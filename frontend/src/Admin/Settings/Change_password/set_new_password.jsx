import React, { useState, useRef, useEffect } from "react";
import { Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../../services/userAuthApi";
import { getToken, removeToken } from "../../../services/LocalStorageService";
function NewPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const { access_token } = getToken();
  const [ResetPassword] = useResetPasswordMutation();
  const formRef = useRef();
  const navigate = useNavigate();
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    if (passwordChanged) {
      const timer = setTimeout(() => {
        removeToken();
        navigate("/");
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [passwordChanged, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const actualData = {
      password: data.get("password"),
      password2: data.get("confirm_password"),
    };

    const res = await ResetPassword({ actualData, access_token });

    if (res.error) {
      console.log(res.error.data.errors);
      setPasswordError(res.error.data.errors);
    } else {
      setPasswordSuccess(res.data.msg);
      console.log(res.data.msg);
      setPasswordChanged(true);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center my-4">
        Set New Password
      </h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {passwordChanged ? (
          <p className="mt-4 text-center text-green-600">{passwordSuccess}</p>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-4 ">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                New Password:
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                onChange={handleNewPasswordChange}
                autoComplete="given-name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                style={{ marginBottom: "4px" }}
              />
              {passwordError.password ? (
                <Typography
                  style={{ fontSize: 12, color: "red", paddingLeft: 10 }}
                >
                  {passwordError.password[0]}
                </Typography>
              ) : (
                ""
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirm_password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm new password"
                onChange={handleConfirmPasswordChange}
                autoComplete="given-namr"
                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                style={{ marginBottom: "4px" }}
              />
              {passwordError.password2 ? (
                <Typography
                  style={{ fontSize: 12, color: "red", paddingLeft: 10 }}
                >
                  {passwordError.password2[0]}
                </Typography>
              ) : (
                ""
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Set New Password
              </button>
            </div>
            {passwordError.non_field_errors ? (
              <Alert severity="error">
                {passwordError.non_field_errors[0]}
              </Alert>
            ) : (
              ""
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default NewPasswordForm;
