import React from "react";
import { Typography, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import { useRef } from "react";
import { useRegisterUserMutation } from "../../services/userAuthApi";
import { storeToken, getToken } from "../../services/LocalStorageService";
function UserRegistration() {
  const [server_error, setServerError] = useState({});
  const formRef = useRef();
  const [registerUser] = useRegisterUserMutation();
  const { access_token } = getToken();
  const navigate = useNavigate();

  const resetformFields = () => {
    formRef.current.reset();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const actualData = {
      first_name: data.get("first_name"),
      middle_name: data.get("middle_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      mobile_number: data.get("mobile_number"),
      password: data.get("password"),
      password2: data.get("confirm_password"),
      role: data.get("role"),
      status: data.get("status"),
    };

    const res = await registerUser({ actualData, access_token });

    if (res.error) {
      console.log(res.error.data.errors);
      setServerError(res.error.data.errors);
    }

    if (res.data) {
      resetformFields();
      storeToken(res.data.token);
    }
  };

  return (
    <div>
      <div className="text-3xl flex justify-center font-bold">
        Users Details
      </div>
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
                className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {server_error.name ? (
                <Typography
                  style={{ fontSize: 12, color: "red", paddingLeft: 10 }}
                >
                  {server_error.name[0]}
                </Typography>
              ) : (
                ""
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
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
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
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
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
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="confirm_password"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Confirm password
              </label>

              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                placeholder="Confirm password"
                autoComplete="given-name"
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
                  className="block  my-px px-2 w-full bg-white h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <p className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex text-base  laptop:px-40 desktop:px-52  tablet:px-32">
            Note: User ID will be auto generate by system. It will be a
            alphanumeric value of six characters.
          </p>

          <div className="desktop:mt-24 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-40 desktop:px-52  tablet:px-32">
            <button
              type="button"
              onClick={() => navigate("/Admin/User/View/details/")}
              className="rounded-md bg-indigo-600 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              View Users
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-md bg-lime-700 w-[36rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Register Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserRegistration;
