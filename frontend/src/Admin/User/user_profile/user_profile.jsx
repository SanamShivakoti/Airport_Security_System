import React, { useRef, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useAdminProfileViewQuery } from "../../../services/userAuthApi";
import { getToken, removeToken } from "../../../services/LocalStorageService";
import img from "./user.png";
import { useHistory } from "react-router-dom";
import { removeUserToken } from "../../../features/authSlice";
import { useDispatch } from "react-redux";

function Profile() {
  const inputRef = useRef(null);
  const [server_error, setServerError] = useState({});
  const formRef = useRef();
  const dispatch = useDispatch();

  const [image, setImage] = useState("");
  const { access_token } = getToken();
  const { data, refetch, isLoading, error } = useAdminProfileViewQuery({
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
  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
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
    refetch();
    if (data) {
      setUserData({
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        mobile_number: data.mobile_number || "",
        avatar: data.avatar || "",
      });
    }
  }, [data]);

  const { user_id } = data || {};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const actualData = {
      first_name: data.get("first_name"),
      middle_name: data.get("middle_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      mobile_number: data.get("mobile_number"),
      password: "",
      password2: "",
      user_id,
    };
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(removeUserToken());
    removeToken();
    navigate("/");
  };

  return (
    <div>
      <div className="text-3xl flex justify-center font-bold pb-2">Profile</div>
      <div className="flex flex-col items-center ">
        <div onClick={handleImageClick}>
          <div className="w-32 h-32 rounded-full  overflow-hidden">
            {userData.avatar ? (
              <img
                src={`${process.env.REACT_APP_IMAGE_URL}${userData.avatar}`}
                alt=""
              />
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
      <div className="mt-8 flex flex-col items-center justify-center ">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid w-auto grid-cols-1 gap-4 laptop:px-40 desktop:px-52  tablet:px-32">
            <div className="mt-4 ml-32 flex items-center">
              <label
                htmlFor="first-name"
                className="block ml-1 text-xl text-left font-large  leading-6 text-gray-900 "
              >
                First name :
              </label>
              <div className="my-px ml-6 text-xl text-gray-900 ">
                {userData.first_name}
              </div>
            </div>

            <div className="mt-4 ml-32 flex items-center">
              <label
                htmlFor="middle-name"
                className="block ml-1 text-xl text-left font-medium leading-6 text-gray-900 "
              >
                Middle name :
              </label>
              <div className="my-px ml-6 text-xl text-gray-900 ">
                {userData.middle_name}
              </div>
            </div>

            <div className="mt-4 ml-32 flex items-center">
              <label
                htmlFor="last_name"
                className="block ml-1 text-xl text-left font-medium leading-6 text-gray-900 "
              >
                Last name :
              </label>
              <div className="my-px ml-6 text-xl text-gray-900 ">
                {userData.last_name}
              </div>
            </div>

            <div className="mt-4 ml-32 flex items-center">
              <label
                htmlFor="email"
                className="block ml-1 text-xl text-left font-medium leading-6 text-gray-900 "
              >
                Email :
              </label>
              <div className="my-px ml-6 text-xl text-gray-900 ">
                {userData.email}
              </div>
            </div>

            <div className="mt-4 ml-32 flex items-center">
              <label
                htmlFor="mobile no."
                className="block ml-1 text-xl text-left font-medium leading-6 text-gray-900 "
              >
                Mobile No. :
              </label>
              <div className="my-px ml-6 text-xl text-gray-900 ">
                {userData.mobile_number}
              </div>
            </div>
          </div>

          <div className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52  tablet:px-32">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-indigo-600 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
