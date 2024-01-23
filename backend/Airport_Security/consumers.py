import cv2
import base64
import json
import random
import string

from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PracticeConsumer(AsyncJsonWebsocketConsumer):

     async def connect(self):
          await self.accept()

     async def receive(self, text_data=None, bytes_data=None, **kwargs):
          print(text_data)
          await self.send('PONG')

class CameraTest(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            # Parse the incoming JSON data
          #   data = json.loads(text_data)

            # Check if the message type is 'capture_image'
            if text_data == 'capture_image':
                
                # Generate a random face ID
                face_id = self.generate_random_face_id()

                # Capture an image when 'q' is pressed
                image_data = await self.capture_image()

                # Send the image via WebSocket
                await self.send_image(face_id, image_data)

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            await self.send_error("Invalid JSON format")

    def generate_random_face_id(self):
        # Generate a random 4-digit number
        random_digits = ''.join(random.choices(string.digits, k=4))

        # Concatenate 'F' with the random digits
        face_id = 'F' + random_digits

        return face_id

    async def capture_image(self):
        # Open the camera
        cap = cv2.VideoCapture(0)

        print("Press 'q' to capture an image.")

        while True:
            ret, frame = cap.read()
            cv2.imshow('Capture Face', frame)

            # Check if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                # Encode the image data in JPEG format
                _, encoded_image = cv2.imencode('.jpg', frame)

                # Release the camera
                cap.release()
                cv2.destroyAllWindows()
                # Return the encoded image as bytes
                return encoded_image.tobytes()

    

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