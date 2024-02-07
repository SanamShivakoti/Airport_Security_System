import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PassengersRegistration from "../../Passengers";
import UserViewPassengers from "../../View_passengers";
import UserEditPassengers from "../../edit_passenger/user_edit_passenger";
import UserSettings from "../../Settings";
import OtpVerification from "../../Settings/change_password";
import UserProfile from "../../user_profile/user_profile";
import "./sidebar.css";
import Content from "../Contents";
import { sidebar_data } from "./sidebar_data";
import { getToken } from "../../../services/LocalStorageService";
import { useAdminProfileViewQuery } from "../../../services/userAuthApi";
// import Avatar from "react-avatar";
import img from "./user.png";
function Usersidebar() {
  const navigate = useNavigate();
  const { access_token } = getToken();
  const [userName, setUserName] = useState({});
  const { data } = useAdminProfileViewQuery({ access_token });

  useEffect(() => {
    if (data) {
      setUserName(data);
    }
  }, [data]);

  return (
    <div className="main-content">
      <div className="content">
        <div id="main-title">Airport Secuirty System</div>
        <div id="User-role-title">User</div>
        <div className="profile" onClick={() => navigate("/User/profile/view")}>
          {/* <Avatar src="./user.png" /> */}
          <img id="profile-image" alt="" src={img} />
          <div id="ProfileName">{`${userName.first_name} ${userName.middle_name} ${userName.last_name}`}</div>
          <hr />
        </div>

        {/**Setting the sidebar clickable for render the selected items */}
        <ul className="SidebarList">
          {sidebar_data.map((val, key) => {
            const isActive = window.location.pathname === val.link;

            return (
              <li
                key={key}
                className={`row ${isActive ? "active" : ""}`}
                onClick={() => navigate(val.link)}
              >
                {/**Display the icons and the name of the corresponding icons as title */}
                <div id="icon">{val.icon}</div>
                <div id="titlename">{val.title}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <Routes>
        {/**User dashboard route */}
        <Route path="/dashboard" element={<Content />} />

        {/**User Passenger Registration route */}
        <Route
          path="/Passenger/Registration"
          element={<PassengersRegistration />}
        />

        {/**User View Passengers route */}
        <Route path="/View/Passengers" element={<UserViewPassengers />} />
        <Route
          path="View/Passengers/Edit/:passenger_id"
          element={<UserEditPassengers />}
        />

        {/**User Setting Page route */}
        <Route path="/Settings" element={<UserSettings />} />

        {/* User verify OTP for password change */}
        <Route path="/Settings/change/password" element={<OtpVerification />} />

        <Route path="/profile/view" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default Usersidebar;
