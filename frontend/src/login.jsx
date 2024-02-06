import { Alert, CircularProgress, Typography } from "@mui/material";

import React, { useState, useEffect, useRef } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import "./login.css";
import { useLoginUserMutation } from "./services/userAuthApi";
import { storeToken } from "./services/LocalStorageService";
import { useDispatch } from "react-redux";
import { getToken } from "./services/LocalStorageService";
import { setUserToken } from "./features/authSlice";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [server_error, setServerError] = useState({});
  const formRef = useRef();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleForgotPassword = () => {
    navigate("/Admin/forget/password/reset/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const actualData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    const res = await loginUser(actualData);
    if (res.error) {
      // console.log(typeof(res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors);
    }

    if (res.data) {
      // console.log(typeof(res.data))
      const role = res.data.role;

      if (role === "Admin") {
        storeToken(res.data.token);
        let { access_token } = getToken();
        dispatch(
          setUserToken({
            access_token: access_token,
            isAuthenticated: true,
            role: "Admin",
          })
        );
        navigate("/Admin/dashboard");
      } else {
        setServerError({
          non_field_errors: ["!! Permission denied !!. You are not a Admin"],
        });
      }
    }
  };
  // let { access_token } = getToken()
  // useEffect(() => {
  //   dispatch(setUserToken({ access_token: access_token }))
  // }, [access_token, dispatch])

  return (
    <div className="main-container">
      {server_error.non_field_errors
        ? console.log(server_error.non_field_errors[0])
        : ""}
      <h2 id="title">Airport Security System</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="login-container">
        <div>
          <h2>Admin Login Panel</h2>
          <div id="Userid">Email</div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {server_error.email ? (
            <Typography style={{ fontSize: 12, color: "red", paddingLeft: 10 }}>
              {server_error.email[0]}
            </Typography>
          ) : (
            ""
          )}
          <div id="Password">Password</div>
          <div className="pass">
            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {server_error.password ? (
              <Typography
                style={{ fontSize: 12, color: "red", paddingLeft: 10 }}
              >
                {server_error.password[0]}
              </Typography>
            ) : (
              ""
            )}
            <div className="eyeicon">
              {showPassword ? (
                <AiFillEye onClick={handleTogglePassword} />
              ) : (
                <AiFillEyeInvisible onClick={handleTogglePassword} />
              )}
            </div>
          </div>
          <p
            id="forgotpassword"
            onClick={handleForgotPassword}
            className="forgot-password-link"
          >
            Forgot Password?
          </p>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <button onClick={handleSubmit}>Login</button>
          )}
          {server_error.non_field_errors ? (
            <Alert severity="error">{server_error.non_field_errors[0]}</Alert>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};
