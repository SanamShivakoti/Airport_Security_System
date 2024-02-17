import React, { useRef, useEffect, useState } from "react";
import { Alert } from "@mui/material";

const StaffDetails = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [unkownFace, setUnknownFace] = useState("");
  const [faceId, setFaceID] = useState("");
  const [unknownMessage, setUnknownMessage] = useState("");
  const [firstName, setFirstName] = useState("N/A");
  const [middleName, setMiddleName] = useState("N/A");
  const [lastName, setLastName] = useState("N/A");
  const [email, setEmail] = useState("N/A");
  const [mobile, setMobile] = useState("N/A");
  const [address, setAddress] = useState("N/A");
  const [departure, setDeparture] = useState("N/A");
  const [error, setError] = useState(null);

  const ws = useRef(null);
  useEffect(() => {
    // ws.current = new WebSocket("ws://127.0.0.1:8000/face/detection");
    ws.current = new WebSocket("ws://192.168.25.25:8000/face/detection");

    ws.current.onopen = () => {};

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const resultType = data.result_type;

      if (resultType === "Known") {
        const faceID = data.label;
        setFaceID(faceID);
      } else if (resultType === "Unknown") {
        const unknownMessage = "Unauthorized";
        setUnknownMessage(unknownMessage);
        const unknown_face = data.unknown_face_base64;
        const dataUrl = `data:image/jpeg;base64,${unknown_face}`;

        setUnknownFace(dataUrl);
        setTimeout(() => {
          setUnknownMessage(null);
        }, 1 * 60 * 1000);
      }
    };

    ws.current.onclose = () => {};

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (faceId) {
      fetchData();
    }
  }, [faceId]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/staff/${encodeURIComponent(
          faceId
        )}/`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        const serverError = await res.json();

        if (res.status === 404) {
          setUnknownMessage("Not Found");
        }

        setUnknownMessage(serverError.detail);

        setTimeout(() => {
          setError(null);
        }, 1 * 60 * 1000);
      } else {
        const result = await res.json();
        console.log("Result", result);
        setError(null);
        setFirstName(result.first_name);
        setMiddleName(result.middle_name);
        setLastName(result.last_name);
        setEmail(result.email);
        setMobile(result.mobile_number);
        setAddress(result.address);
        setDeparture(result.department);
        setImageUrl(result.faces);

        setTimeout(() => {
          setError(null);
          setFirstName("N/A");
          setMiddleName("N/A");
          setLastName("N/A");
          setEmail("N/A");
          setMobile("N/A");
          setAddress("N/A");
          setDeparture("N/A");
          setImageUrl("");
        }, 1 * 60 * 1000);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (unkownFace) {
      notifyData();
    }
  }, [unkownFace]);

  const notifyData = async () => {
    const formData = new FormData();
    formData.append("imageData", unkownFace);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/send_unknown_face/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
      } else {
      }
    } catch (error) {}
  };

  const handleOpenCamera = async () => {
    setUnknownMessage("");
    sendMessage("detect_faces");
  };

  const sendMessage = (message) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
    }
  };
  return (
    <div className="container mx-auto mt-8 p-8 bg-gray-200 rounded shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Display Details */}
        <div>
          <h1 className="text-4xl mb-8">Staff Details</h1>
          {unknownMessage && (
            <div className="flex items-center mb-4">
              <Alert severity="error">{unknownMessage}</Alert>
            </div>
          )}
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">
              First Name:
            </label>
            <p className="text-gray-800">{firstName}</p>
          </div>
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">
              Middle Name:
            </label>
            <p className="text-gray-800">{middleName}</p>
          </div>
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">
              Last Name:
            </label>
            <p className="text-gray-800">{lastName}</p>
          </div>
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">Email:</label>
            <p className="text-gray-800">{email}</p>
          </div>
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">
              Mobile No.:
            </label>
            <p className="text-gray-800">{mobile}</p>
          </div>
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">Address:</label>
            <p className="text-gray-800">{address}</p>
          </div>
          <div className="mb-8 flex items-center">
            <label className="font-bold w-1/3 text-right pr-4">
              Department:
            </label>
            <p className="text-gray-800">{departure}</p>
          </div>
        </div>

        {/* Display Image */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl mb-8">Face Photo</h2>
          <div className="mb-8 flex items-center">
            <div className="w-40 h-40 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Captured face"
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mb-8">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleOpenCamera}
        >
          Scan Face
        </button>
      </div>
    </div>
  );
};

export default StaffDetails;
