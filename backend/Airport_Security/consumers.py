import cv2
import base64
import json
import random
import string
import os 
import re
from passporteye import read_mrz
import numpy as np
from sklearn.svm import OneClassSVM
import time

from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PracticeConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data == 'passportscan':
            try:
                cap = cv2.VideoCapture(0)
                time.sleep(2)
                
                # Record video for 10 seconds
                start_time = time.time()
                while time.time() - start_time < 10:
                    ret, frame = cap.read()
                    cv2.imshow("Frame", frame)

                    # Break the loop if 'q' key is pressed
                    if cv2.waitKey(1) & 0xFF == ord("q"):
                        break

                # Save the captured image
                image_path = "captured_image.jpg"
                cv2.imwrite(image_path, frame)

                # Release the video capture object and close the OpenCV window
                cap.release()
                cv2.destroyAllWindows()

                mrz = read_mrz(image_path)

                # Obtain image
                mrz_data = mrz.to_dict()

                # Use regex to remove '<' from ID number if present
                id_number = re.sub("<", "", mrz_data["number"])

                # Return the ID number as JSON response
                response_data = {"id_number": id_number, "type": "passportNumber"}

                # Remove the captured image
                if os.path.exists(image_path):
                    os.remove(image_path)
                    

                data = {"id_number": id_number, "type": "passportNumber"}
                

                # Remove the captured image
                if os.path.exists(image_path):
                    os.remove(image_path)
                    

                await self.send(text_data=json.dumps(data))
            except Exception as e:
                error_response = {"error": "Unable to scan the passport. Please try again."}
                await self.send(text_data=json.dumps(error_response))

class CameraTest(AsyncJsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_directory = os.path.dirname(os.path.abspath(__file__))


    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:

            # Check if the message type is 'capture_image'
            if text_data == 'capture_image':

                await self.detect_faces()



        except json.JSONDecodeError as e:
            
            await self.send_error("Invalid JSON format")

    def generate_random_face_id(self):
        # Generate a random 4-digit number
        random_digits = ''.join(random.choices(string.digits, k=4))

        # Concatenate 'F' with the random digits
        face_id = 'F' + random_digits

        return face_id

    async def capture_image(self):
        cap = cv2.VideoCapture(0)
        cascade_file = os.path.join(self.current_directory, "haarcascade_frontalface_alt.xml")
        face_cascade = cv2.CascadeClassifier(cascade_file)

        skip = 0
        face_data = []
        dataset_path = os.path.abspath("./face_dataset/")
        os.makedirs(dataset_path, exist_ok=True)
        face_id = self.generate_random_face_id()

        while True:
            ret,frame = cap.read()
            gray_frame = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)

            if ret == False:
                continue

            faces = face_cascade.detectMultiScale(gray_frame,1.3,5)
            if len(faces) == 0:
                continue

            k = 1

            faces = sorted(faces, key = lambda x : x[2]*x[3] , reverse = True)

            skip += 1

            for face in faces[:1]:
                x,y,w,h = face

                offset = 5
                face_offset = frame[y-offset:y+h+offset,x-offset:x+w+offset]
                face_selection = cv2.resize(face_offset,(100,100))

                if skip % 10 == 0:
                    face_data.append(face_selection)
                    


                cv2.imshow(str(k), face_selection)
                k += 1
                
                cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)

            cv2.imshow("faces",frame)

            # Check if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                # Encode the image data in JPEG format
                _, encoded_image = cv2.imencode('.jpg', face_selection)
                face_data = np.array(face_data)
                face_data = face_data.reshape((face_data.shape[0], -1))
                np.save(os.path.join(dataset_path, f'{face_id}.npy'), face_data)
                

                # Release the camera
                cap.release()
                cv2.destroyAllWindows()
                # Return the encoded image as bytes
                return face_id, encoded_image.tobytes()
            

    

    async def send_image(self, face_id, image_data):
        # Encode the image data in base64
        base64_image = base64.b64encode(image_data).decode('utf-8')

        # Create a JSON payload with the base64-encoded image and face ID
        payload = json.dumps({
            'type': 'image',
            'image': base64_image,
            'face_id': face_id,
        })

        # Send the payload via WebSocket
        await self.send(payload)

    async def send_error(self, message):
        # Send an error message
        await self.send_json({'type': 'error', 'message': message})

    def euclidean_distance(self, v1, v2):
        return np.sqrt(((v1 - v2) ** 2).sum())

    def knn(self, train, test, k=5):
        distances = []
        for i in range(train.shape[0]):
            ix = train[i, :-1]
            iy = train[i, -1]
            d = self.euclidean_distance(test, ix)
            distances.append([d, iy])
        dk = sorted(distances, key=lambda x: x[0])[:k]
        labels = np.array(dk)[:, -1]
        output = np.unique(labels, return_counts=True)
        index = np.argmax(output[1])
        return output[0][index], dk[0][0]  # Return both label and distance

    async def detect_faces(self):
        cap = cv2.VideoCapture(0)

        cascade_file = os.path.join(self.current_directory, "haarcascade_frontalface_alt.xml")
        face_cascade = cv2.CascadeClassifier(cascade_file)

        dataset_path = os.path.abspath("./face_dataset/")
        face_data = []
        labels = []
        class_id = 0
        names = {}

        # Dataset preparation
        for fx in os.listdir(dataset_path):
            if fx.endswith('.npy'):
                names[class_id] = fx[:-4]
                try:
                    data_item = np.load(os.path.join(dataset_path, fx))
                except Exception as e:
                    continue

                # Add a check for an empty data item
                if data_item.size == 0:
                    class_id += 1
                    continue

                face_data.append(data_item)

                target = class_id * np.ones((data_item.shape[0],))
                class_id += 1
                labels.append(target)

        # Check if any valid data was found
        if not face_data:
            label = "unknown"
            
            # Capture frames for 10 seconds and send the last frame as unknown face
            start_time = time.time()
            unknown_frame = None
            while time.time() - start_time < 10:
                ret, frame = cap.read()
                if ret:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

                    for face in faces:
                        x, y, w, h = face
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                    cv2.imshow("Faces", frame)
                    cv2.waitKey(1)

                    # Store the last frame
                    unknown_frame = frame
                    

            # Send the last captured frame as unknown face
            if unknown_frame is not None:
                _, encoded_unknown_face = cv2.imencode('.jpg', unknown_frame)
                unknown_face_base64 = base64.b64encode(encoded_unknown_face).decode('utf-8')
               
            else:
                await self.send_error("Error capturing frame.")

            cap.release()
            cv2.destroyAllWindows()
            if label == "unknown":
                # Capture an image when 'q' is pressed
                face_id, image_data = await self.capture_image()

                # Send the image via WebSocket
                await self.send_image(face_id, image_data)
            return

        face_dataset = np.concatenate(face_data, axis=0)
        face_labels = np.concatenate(labels, axis=0).reshape((-1, 1))

        trainset = np.concatenate((face_dataset, face_labels), axis=1)

        # Train a one-class SVM on the known face data
        svm = OneClassSVM(gamma='auto')
        svm.fit(face_dataset)

        font = cv2.FONT_HERSHEY_SIMPLEX

        start_time = time.time()
        result_sent = False

        # Collect some initial distances for dynamic threshold calculation
        initial_distances = []
        for _ in range(30):  # Collect distances from the first 30 frames
            ret, frame = cap.read()
            if ret:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, 1.3, 5)

                for face in faces:
                    x, y, w, h = face
                    offset = 5
                    face_section = frame[y - offset: y + h + offset, x - offset: x + w + offset]

                    # Add a check for an empty face section
                    if not face_section.size == 0:
                        face_section = cv2.resize(face_section, (100, 100))
                        _, distance = self.knn(trainset, face_section.flatten())
                        initial_distances.append(distance)

        # Set the threshold dynamically
        dynamic_threshold = 9000

        while True:
            ret, frame = cap.read()
            if ret == False:
                continue
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            for face in faces:
                x, y, w, h = face
                offset = 5
                face_section = frame[y - offset: y + h + offset, x - offset: x + w + offset]

                # check for an empty face section
                if not face_section.size == 0:
                    # Use the SVM decision function to get the confidence score
                    face_section = cv2.resize(face_section, (100, 100))
                    _, distance = self.knn(trainset, face_section.flatten())

                    # Set the threshold dynamically
                    if distance > dynamic_threshold:
                        label = 'unknown'
                        # Capture unknown face
                        _, encoded_unknown_face = cv2.imencode('.jpg', frame)
                        unknown_face_base64 = base64.b64encode(encoded_unknown_face).decode('utf-8')

                        face_deteced = 'unknown'
 
 


                    else:
                        # Perform KNN for known faces
                        out, _ = self.knn(trainset, face_section.flatten())
                        label = names[int(out)]
                        unknown_face_base64 = None
                        face_deteced = 'Known'

                       
                    cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2,
                                cv2.LINE_AA)
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 2)


            cv2.imshow("Faces", frame)
            cv2.waitKey(1)

            elapsed_time = time.time() - start_time
            if elapsed_time >= 10 and not result_sent:
                result_sent = True
                cap.release()
                cv2.destroyAllWindows()
                if face_deteced == "Known":
                     await self.send_json({"error": f"This face is already registered as {label}"})

                if face_deteced == "unknown":
                        # # Capture an image when 'q' is pressed
                        face_id, image_data = await self.capture_image()

                        # Send the image via WebSocket
                        await self.send_image(face_id, image_data)

                return





class FaceDetectionConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_directory = os.path.dirname(os.path.abspath(__file__))

    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data == 'detect_faces':
            await self.detect_faces()

    def euclidean_distance(self, v1, v2):
        return np.sqrt(((v1 - v2) ** 2).sum())

    def knn(self, train, test, k=5):
        distances = []
        for i in range(train.shape[0]):
            ix = train[i, :-1]
            iy = train[i, -1]
            d = self.euclidean_distance(test, ix)
            distances.append([d, iy])
        dk = sorted(distances, key=lambda x: x[0])[:k]
        labels = np.array(dk)[:, -1]
        output = np.unique(labels, return_counts=True)
        index = np.argmax(output[1])
        return output[0][index], dk[0][0]  # Return both label and distance

    async def detect_faces(self):
        cap = cv2.VideoCapture(0)

        cascade_file = os.path.join(self.current_directory, "haarcascade_frontalface_alt.xml")
        face_cascade = cv2.CascadeClassifier(cascade_file)

        dataset_path = os.path.abspath("./face_dataset/")
        face_data = []
        labels = []
        class_id = 0
        names = {}

        # Dataset preparation
        for fx in os.listdir(dataset_path):
            if fx.endswith('.npy'):
                names[class_id] = fx[:-4]
                try:
                    data_item = np.load(os.path.join(dataset_path, fx))
                except Exception as e:
                    
                    continue

                # Add a check for an empty data item
                if data_item.size == 0:
                    class_id += 1
                    continue

                face_data.append(data_item)

                target = class_id * np.ones((data_item.shape[0],))
                class_id += 1
                labels.append(target)

        # Check if any valid data was found
        if not face_data:
            # Capture frames for 10 seconds and send the last frame as unknown face
            start_time = time.time()
            unknown_frame = None
            while time.time() - start_time < 10:
                ret, frame = cap.read()
                if ret:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

                    for face in faces:
                        x, y, w, h = face
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                    cv2.imshow("Faces", frame)
                    cv2.waitKey(1)

                    # Store the last frame
                    unknown_frame = frame

            # Send the last captured frame as unknown face
            if unknown_frame is not None:
                _, encoded_unknown_face = cv2.imencode('.jpg', unknown_frame)
                unknown_face_base64 = base64.b64encode(encoded_unknown_face).decode('utf-8')
                await self.send_result('Unknown', unknown_face_base64)
            else:
                await self.send_error("Error capturing frame.")

            cap.release()
            cv2.destroyAllWindows()
            return

        face_dataset = np.concatenate(face_data, axis=0)
        face_labels = np.concatenate(labels, axis=0).reshape((-1, 1))

        trainset = np.concatenate((face_dataset, face_labels), axis=1)

        # Train a one-class SVM on the known face data
        svm = OneClassSVM(gamma='auto')
        svm.fit(face_dataset)

        font = cv2.FONT_HERSHEY_SIMPLEX

        start_time = time.time()
        result_sent = False

        # Collect some initial distances for dynamic threshold calculation
        initial_distances = []
        for _ in range(30):  # Collect distances from the first 30 frames
            ret, frame = cap.read()
            if ret:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, 1.3, 5)

                for face in faces:
                    x, y, w, h = face
                    offset = 5
                    face_section = frame[y - offset: y + h + offset, x - offset: x + w + offset]

                    # Add a check for an empty face section
                    if not face_section.size == 0:
                        face_section = cv2.resize(face_section, (100, 100))
                        _, distance = self.knn(trainset, face_section.flatten())
                        initial_distances.append(distance)

        # Set the threshold dynamically
        dynamic_threshold = 9000

        while True:
            ret, frame = cap.read()
            if ret == False:
                continue
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            for face in faces:
                x, y, w, h = face
                offset = 5
                face_section = frame[y - offset: y + h + offset, x - offset: x + w + offset]

                # check for an empty face section
                if not face_section.size == 0:
                    # Use the SVM decision function to get the confidence score
                    face_section = cv2.resize(face_section, (100, 100))
                    _, distance = self.knn(trainset, face_section.flatten())

                    # Set the threshold dynamically
                    if distance > dynamic_threshold:
                        label = 'unknown'
                        # Capture unknown face
                        _, encoded_unknown_face = cv2.imencode('.jpg', frame)
                        unknown_face_base64 = base64.b64encode(encoded_unknown_face).decode('utf-8')
                    else:
                        # Perform KNN for known faces
                        out, _ = self.knn(trainset, face_section.flatten())
                        label = names[int(out)]
                        unknown_face_base64 = None

                    cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2,
                                cv2.LINE_AA)
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 2)

            cv2.imshow("Faces", frame)
            cv2.waitKey(1)

            elapsed_time = time.time() - start_time
            if elapsed_time >= 10 and not result_sent:
                await self.send_result(label, unknown_face_base64)
                result_sent = True
                cap.release()
                cv2.destroyAllWindows()
                return

    async def send_result(self, label, unknown_face_base64):
        if unknown_face_base64 is None:
            result_type = 'Known'
            payload = {
                'result_type': result_type,
                'label': label,
            }
        else:
            result_type = 'Unknown'
            payload = {
                'result_type': result_type,
                'label': label,
                'unknown_face_base64': unknown_face_base64
            }

        await self.send_json(payload)

    async def send_error(self, message):
        payload = {
            'type': 'error',
            'message': message,
        }
        await self.send_json(payload)





class DeleteFIleConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            # Decode the JSON-encoded message
            data = json.loads(text_data)

            # Extract the parameters from the decoded message
            face_id = data.get("face_id")
            message_type = data.get("type")

            if message_type == "delete_staff":
                # Call a function to delete the file
                await self.delete_face_file(face_id)
        except Exception as e:
            pass

    async def delete_face_file(self, face_id):
        try:
            # Define the path to the face file based on the face_id
            file_path = os.path.join(os.path.abspath("./face_dataset/"), F"{face_id}.npy")

            # Check if the file exists
            if os.path.exists(file_path):
                # Delete the file
                os.remove(file_path)

                await self.send_json({"message": "staff deleted successfully"})
            else:
                await self.send_json({"error": f"Face file with ID {face_id} not found"})
        except Exception as e:
            await self.send_json({"error": str(e)})

