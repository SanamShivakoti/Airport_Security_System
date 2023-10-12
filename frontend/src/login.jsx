import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import "./login.css";
export const Login = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    console.log(`Logging in with usename: ${userid} and password: ${password}`);
  };

  return (
    <div className="main-container">
      <h2 id="title">Airport Security System</h2>
      <div className="login-container">
        <h2>Login</h2>
        <div id="Userid">User ID</div>
        <input
          type="text"
          placeholder="User ID"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />
        <div id="Password">Password</div>
        <div className="pass">
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
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
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};
