import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdminProfileViewQuery,
  useUpdateUserProfileMutation,
} from "../../services/userAuthApi";
import {
  getToken,
  storeToken,
  removeToken,
} from "../../services/LocalStorageService";
import img from "./user.png";
import { removeUserToken } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { Alert, Typography } from "@mui/material";
function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unauthorized, setUnauthorized] = useState(false);
  const inputRef = useRef(null);
  const [fetch, setFetch] = useState(false);
  const [server_error, setServerError] = useState("");
  const formRef = useRef();
  const [updateUser] = useUpdateUserProfileMutation();
  const [image, setImage] = useState("");
  const { access_token } = getToken();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const { data, refetch, isLoading, error } = useAdminProfileViewQuery({
    access_token,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        dispatch(removeUserToken());
        removeToken();
        return navigate("/User/login/");
      }
    }
  }, [error]);
  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [userData, setUserData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    avatar: data?.avatar || null,
  });

  useEffect(() => {
    // refetch();
    if (data) {
      setUserData({
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        mobile_number: data.mobile_number || "",
        avatar: data.avatar || "",
      });
      setProfileImageUrl(`${process.env.REACT_APP_IMAGE_URL}${data.avatar}`);
    }
  }, [data]);

  const { user_id } = data || {};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmptyFields([]);
    setServerError("");
    const formData = new FormData(formRef.current);
    if (image) {
      formData.append("avatar", image);
    }
    const actualData = {
      first_name: formData.get("first_name"),
      middle_name: formData.get("middle_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      mobile_number: formData.get("mobile_number"),
      avatar: formData.avatar,
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
    const email = actualData["email"];
    if (!emailRegex.test(email)) {
      setServerError("Invalid email format");
      return;
    }

    const mobileNumber = actualData["mobile_number"];
    if (mobileNumber) {
      if (mobileNumber.length !== 10) {
        setServerError("Mobile number must be 10 digits long");
        return;
      }
    }

    const res = await updateUser({ user_id, formData, access_token });
    if (res.error) {
      if (res.error.status === 401) {
        setUnauthorized(true);
      }
      setServerError(res.error.data.detail);
    }

    if (res.data) {
      setFetch(true);
      setSuccessMessage(res.data.msg);
      storeToken(res.data.token);
    }
  };

  useEffect(() => {
    if (fetch) {
      refetch();
      setFetch(false);
    }
  });

  useEffect(() => {
    if (unauthorized) {
      dispatch(removeUserToken());
      removeToken();
      return navigate("/User/login/");
    }
  }, [unauthorized]);

  return (
    <div>
      <div className="text-3xl flex justify-center font-bold pb-2">
        Settings
      </div>
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
      <div className="flex flex-col items-center ">
        <p className="pb-2 text-2xl">Edit Profile</p>
        <div onClick={handleImageClick}>
          <div className="w-32 h-32 rounded-full  overflow-hidden">
            {userData.avatar || image ? (
              <img src={profileImageUrl} alt="" />
            ) : (
              <img src={img} alt="" />
            )}

            <input
              type="file"
              ref={inputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 ">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid w-auto grid-cols-2 gap-4 laptop:px-40 desktop:px-52  tablet:px-32">
            <div className="mt-4">
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
                value={userData.mobile_number}
                onChange={(e) =>
                  setUserData({ ...userData, mobile_number: e.target.value })
                }
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52  tablet:px-32">
            <button
              type="button"
              onClick={() => navigate("/User/Settings/change/password/")}
              className="rounded-md bg-indigo-600 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Change Password
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-md bg-lime-700 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
