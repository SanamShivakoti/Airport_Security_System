import { Typography } from '@mui/material';

import React, { useState, useEffect , useRef} from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import "./login.css";
import { useLoginUserMutation } from "./services/userAuthApi";
import { storeToken } from "./services/LocalStorageService";
import { useDispatch } from "react-redux";
import { getToken } from "./services/LocalStorageService";
import { setUserToken } from "./features/authSlice";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [server_error, setServerError] = useState({})
  const formRef = useRef();
  const [loginUser] = useLoginUserMutation()
  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if(res.error){
      console.log(typeof(res.error.data.errors))
      console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }

    if(res.error){
      console.log(typeof(res.data))
      console.log(res.data)
      storeToken(res.data.token)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
    }
  }
  let { access_token } = getToken()
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }))
  }, [access_token, dispatch])

  return (
    <div className="main-container">
      <h2 id="title">Airport Security System</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-container">
          <h2>Login</h2>
          <div id="Userid">User ID</div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            name='email'
            onChange={(e) => setEmail(e.target.value)}
          />
           {server_error.email ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}
          <div id="Password">Password</div>
          <div className="pass">
            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                name='password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="eyeicon">
              {showPassword ? (
                <AiFillEye onClick={handleTogglePassword} />
              ) : (
                <AiFillEyeInvisible onClick={handleTogglePassword} />
              )}
            </div>
          </div>
          <p id="forgotpassword">Forgot Password?</p>
          <button onClick={handleSubmit}>Login</button>
        </div>
      </form>
    </div>
  );
};
