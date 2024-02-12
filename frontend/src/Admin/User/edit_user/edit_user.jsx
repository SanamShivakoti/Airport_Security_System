import React from "react";
import { useParams } from "react-router-dom";
import { Alert, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useRef } from "react";
import {
  useUpdateUserMutation,
  useFilterUsersQuery,
} from "../../../services/userAuthApi";
import {
  storeToken,
  getToken,
  removeToken,
} from "../../../services/LocalStorageService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUserToken } from "../../../features/authSlice";

function EditUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [server_error, setServerError] = useState("");
  const formRef = useRef();
  const [updateUser] = useUpdateUserMutation();
  const { access_token } = getToken();
  const { user_id } = useParams();
  const [unauthorized, setUnauthorized] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

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

  const { data, refetch, isLoading, error } = useFilterUsersQuery({
    user_id,
    access_token,
  });

  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        dispatch(removeUserToken());
        removeToken();
        return navigate("/");
      }
    }
  }, [error]);

  const [userData, setUserData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    refetch();
    if (data) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        mobile_number: data.mobile_number || "",
        role: data.role || "",
        status: data.status || "",
      }));
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmptyFields([]);
    setServerError("");
    const data = new FormData(formRef.current);
    const actualData = {
      first_name: data.get("first_name"),
      middle_name: data.get("middle_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      mobile_number: data.get("mobile_number"),
      role: data.get("role"),
      status: data.get("status"),
      user_id,
    };

    // Check if any required fields are empty
    const requiredFields = ["first_name", "last_name", "email"];

    const emptyFields = requiredFields.filter(
      (fieldName) => !userData[fieldName]
    );

    if (emptyFields.length > 0) {
      setEmptyFields(emptyFields);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = data.get("email");
    if (!emailRegex.test(email)) {
      setServerError("Invalid email format");
      return;
    }

    const mobileNumber = data.get("mobile_number");
    if (mobileNumber) {
      if (mobileNumber.length !== 10) {
        setServerError("Mobile number must be 10 digits long");
        return;
      }
    }

    const res = await updateUser({ user_id, actualData, access_token });

    if (res.error) {
      if (res.error.status === 401) {
        setUnauthorized(true);
      }
      setServerError(res.error.data);
    }

    if (res.data) {
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

  return (
    <div>
      <div className="text-3xl flex justify-center font-bold">Edit User</div>
      {server_error && (
        <div className="flex items-center mb-2">
          <Alert severity="error">{server_error}</Alert>
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
            <div className="mt-4">
              <label
                htmlFor="first_name"
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
                value={userData.first_name}
                onChange={(e) =>
                  setUserData({ ...userData, first_name: e.target.value })
                }
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

            <div className="mt-4">
              <label
                htmlFor="middle_name"
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
                value={userData.middle_name}
                onChange={(e) =>
                  setUserData({ ...userData, middle_name: e.target.value })
                }
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="last_name"
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
                value={userData.last_name}
                onChange={(e) =>
                  setUserData({ ...userData, last_name: e.target.value })
                }
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

            <div className="mt-4">
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
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
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

            <div className="mt-4">
              <label
                htmlFor="mobile_number."
                className="block ml-1 text-sm text-left fmobileont-medium leading-6 text-gray-900"
              >
                Mobile No.
              </label>

              <input
                type="number"
                name="mobile_number"
                id="mobile"
                placeholder="Mobile Number"
                autoComplete="given-name"
                value={userData.mobile_number}
                onChange={(e) =>
                  setUserData({ ...userData, mobile_number: e.target.value })
                }
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="role"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Role
              </label>

              <div>
                <select
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={(e) =>
                    setUserData({ ...userData, role: e.target.value })
                  }
                  className="block  my-px px-2 w-full bg-white h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="status"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div>
                <select
                  id="status"
                  name="status"
                  value={userData.status}
                  onChange={(e) =>
                    setUserData({ ...userData, status: e.target.value })
                  }
                  className="block  my-px px-2 w-full bg-white h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52  tablet:px-32">
            <button
              onClick={() => navigate(-1)}
              className="rounded-md bg-blue-500 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-md bg-lime-700 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
