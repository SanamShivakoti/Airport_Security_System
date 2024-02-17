import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import { useRegisterStaffMutation } from "../../services/userAuthApi";
import {
  getToken,
  storeToken,
  removeToken,
} from "../../services/LocalStorageService";
import { Alert } from "@mui/material";
import { removeUserToken } from "../../features/authSlice";
import { useDispatch } from "react-redux";
function StaffsRegistration() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const navigate = useNavigate();
  const ws = useRef(null);
  const { access_token } = getToken();
  const [imageUrl, setImageUrl] = useState("");
  const [faceId, setFaceID] = useState("");
  const [registerStaff] = useRegisterStaffMutation();
  const [server_error, setServerError] = useState({});
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const resetformFields = () => {
    formRef.current.reset();
  };

  useEffect(() => {
    const confirmationMessage = "Are you sure you want to leave this page?";

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmptyFields([]);
    setError("");
    setFormSubmitted(true);
    const data = new FormData(formRef.current);

    if (imageUrl) {
      data.append("faces", imageUrl);
    }
    const actualData = {
      first_name: data.get("first_name"),
      middle_name: data.get("middle_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      mobile_number: data.get("mobile_number"),
      address: data.get("address"),
      department: data.get("department"),
      face_id: data.get("face_id"),
    };

    // Check if any required fields are empty
    const requiredFields = [
      { name: "first_name", label: "First Name" },
      { name: "last_name", label: "Last Name" },
      { name: "email", label: "Email" },
      { name: "address", label: "address" },
      { name: "face_id", label: "face_id" },
      { name: "faces", label: "faces" },
    ];

    const emptyFields = requiredFields.filter(
      ({ name }) => actualData[name] === ""
    );

    if (emptyFields.length > 0) {
      setEmptyFields(emptyFields.map(({ name }) => name));
      return;
    }

    // Check if imageUrl is empty
    if (!imageUrl) {
      setError("Image is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = data.get("email");
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    // Check mobile number length
    const mobileNumber = data.get("mobile_number");
    if (mobileNumber) {
      if (mobileNumber.length !== 10) {
        setError("Mobile number must be 10 digits long");
        return;
      }
    }

    const res = await registerStaff({ data, access_token });

    if (res.error) {
      if (res.error.status === 401) {
        setUnauthorized(true);
      }
      setEmptyFields([]);
      setError(res.error.data.error);
      setServerError(res.error.data.error);
    }

    if (res.data) {
      resetformFields();
      setImageUrl("");
      setFaceID("");
      setEmptyFields([]);
      setSuccessMessage(res.data.msg);
      storeToken(res.data.token);
    }
  };

  useEffect(() => {
    if (unauthorized) {
      dispatch(removeUserToken());
      removeToken();
      return navigate("/");
    }
  }, [unauthorized]);
  useEffect(() => {
    // ws.current = new WebSocket("ws://127.0.0.1:8000/camera/open");
    ws.current = new WebSocket("ws://192.168.25.25:8000/camera/open");

    ws.current.onopen = () => {};

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);
      } else {
        const base64Image = data.image;
        const faceID = data.face_id;

        // Convert the base64 image to a Data URL
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        // Set the image URL in the state
        setImageUrl(dataUrl);
        setFaceID(faceID);
      }
    };

    ws.current.onclose = () => {};

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      ws.current.close();
    };
  }, []);

  const handleOpenCamera = async () => {
    sendMessage("capture_image");
  };
  const sendMessage = (message) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
    }
  };

  return (
    <div>
      <div className="text-3xl font-bold text-center">Staffs Details</div>
      {error && (
        <div className="flex items-center mb-2">
          <Alert severity="error">{error}</Alert>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center mb-2">
          <Alert severity="success">{successMessage}</Alert>
        </div>
      )}
      <div className="mt-8 ">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid w-auto grid-cols-2 gap-4 laptop:px-40 desktop:px-52  tablet:px-32">
            <div>
              <div className="mt-2">
                <label
                  htmlFor="first-name"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  First name
                </label>

                <input
                  type="text"
                  name="first_name"
                  id="first-name"
                  placeholder="First Name"
                  autoComplete="given-name"
                  style={{
                    border: emptyFields.includes("first_name")
                      ? "2px solid red"
                      : "1px solid #D1D5DB",
                  }}
                  className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {emptyFields.includes("first_name") && (
                  <p className="text-red-500">This field is required</p>
                )}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="middle-name"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Middle name
                </label>

                <input
                  type="text"
                  name="middle_name"
                  id="middle-name"
                  placeholder="Middle Name"
                  autoComplete="given-name"
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-2">
                <label
                  htmlFor="last-name"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>

                <input
                  type="text"
                  name="last_name"
                  id="last-name"
                  placeholder="Last Name"
                  autoComplete="given-name"
                  style={{
                    border: emptyFields.includes("last_name")
                      ? "2px solid red"
                      : "1px solid #D1D5DB",
                  }}
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {emptyFields.includes("last_name") && (
                  <p className="text-red-500">This field is required</p>
                )}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="email"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  autoComplete="given-name"
                  style={{
                    border: emptyFields.includes("email")
                      ? "2px solid red"
                      : "1px solid #D1D5DB",
                  }}
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {emptyFields.includes("email") && (
                  <p className="text-red-500">This field is required</p>
                )}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="mobile no."
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Mobile No.
                </label>

                <input
                  type="number"
                  name="mobile_number"
                  id="mobile"
                  placeholder="Mobile Number"
                  autoComplete="given-name"
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="Address"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  autoComplete="given-name"
                  style={{
                    border: emptyFields.includes("address")
                      ? "2px solid red"
                      : "1px solid #D1D5DB",
                  }}
                  className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {emptyFields.includes("address") && (
                  <p className="text-red-500">This field is required</p>
                )}
              </div>

              <div className="mt-2">
                <label
                  htmlFor="Department"
                  className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                >
                  Department
                </label>

                <select
                  name="department"
                  id="department"
                  autoComplete="department-name"
                  className="block  my-px px-2 w-full bg-white h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option>Department-1</option>
                  <option>Department-2</option>
                  <option>Department-3</option>
                  <option>Department-4</option>
                  <option>Department-5</option>
                </select>
              </div>
            </div>

            {/* To display photo */}
            <div className="relative">
              <div className="absolute top-0 right-0">
                <label
                  htmlFor="photo"
                  className="block ml-1 text-sm text-center font-medium leading-6 text-gray-900"
                >
                  Face Photo
                </label>
                <div className="mt-2 px-4 bg-white w-60 h-60 mx-auto p-4 border-4 border-gray-300 rounded-md cursor-not-allowed">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      type="file"
                      alt="Captured face"
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="Face ID"
                    className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
                  >
                    Face ID
                  </label>

                  <input
                    type="text"
                    name="face_id"
                    id="address"
                    placeholder="Face ID"
                    autoComplete="given-name"
                    value={faceId}
                    readOnly
                    style={{
                      border: emptyFields.includes("face_id")
                        ? "2px solid red"
                        : "1px solid #D1D5DB",
                    }}
                    className="block bg-white my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-not-allowed"
                  />
                  {emptyFields.includes("face_id") && (
                    <p className="text-red-500">This field is required</p>
                  )}
                </div>

                {/* <button className="w-40 mt-4" onClick={handleOpenCamera}>
                Open Camera
              </button> */}
              </div>

              {/* ************************************************* */}
            </div>
          </div>
        </form>

        <p className="desktop:mt-12 laptop:mt-8 tablet:mt-8 flex text-base laptop:px-40 desktop:px-52 tablet:px-32">
          Note: Staff ID will be auto generate by system. It will be a
          alphanumeric value of Five characters.
        </p>

        <div className="desktop:mt-12 laptop:mt-8 tablet:mt-8 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52 tablet:px-32">
          <button
            onClick={() => navigate("/Admin/Staff/View/details/")}
            className="rounded-md bg-indigo-600 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Staffs
          </button>

          <button
            onClick={handleOpenCamera}
            className="rounded-md bg-blue-500 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Open Camera
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-md bg-lime-700 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
          >
            Register Staffs
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffsRegistration;
