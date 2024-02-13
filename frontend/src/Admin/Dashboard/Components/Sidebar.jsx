import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserRegistration from "../../User";
import StaffsRegistration from "../../Staffs";
import PassengersRegistration from "../../Passengers";
import EditPassengers from "../../Passengers/edit_passenger/edit_passenger";
import Settings from "../../Settings";
import ViewUsers from "../../User/view_users";
import ViewPassengers from "../../Passengers/view_passengers";
import ViewStaffs from "../../Staffs/view_staffs";
import EditStaffs from "../../Staffs/edit_staffs";
import OtpVerification from "../../Settings/Change_password";
import EditUser from "../../User/edit_user";
import Profile from "../../User/user_profile/user_profile";
import { useAdminProfileViewQuery } from "../../../services/userAuthApi";
import { getToken } from "../../../services/LocalStorageService";
import "./sidebar.css";
import Content from "../Contents";
import { SidebarData } from "./Sidebardata";

// import Avatar from "react-avatar";
import React from "react";
import img from "./user.png";
function Sidebar() {
  const navigate = useNavigate();
  const { access_token } = getToken();
  const [userName, setUserName] = useState({});
  const [image, setImage] = useState();
  const { data } = useAdminProfileViewQuery({ access_token });

  useEffect(() => {
    if (data) {
      setUserName(data);
      setImage(data.avatar);
    }
  }, [data]);

  return (
    <div className="main-content">
      <div className="content">
        <div id="main-title">Airport Secuirty System</div>
        <div id="User-role-title">Admin</div>
        <div
          className="profile"
          onClick={() => navigate("/Admin/profile/view")}
        >
          {/* <Avatar src="./user.png" /> */}
          {/* <img id="profile-image" alt="" src={img} /> */}
          {image ? (
            <img
              id="profile-image"
              src={`${process.env.REACT_APP_IMAGE_URL}${image}`}
              alt=""
            />
          ) : (
            <img id="profile-image" src={img} alt="" />
          )}
          <div id="ProfileName">{`${userName.first_name} ${userName.middle_name} ${userName.last_name}`}</div>
          <hr />
        </div>

        {/**Setting the sidebar clickable for render the selected items */}
        <ul className="SidebarList">
          {SidebarData.map((val, key) => {
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
        {/**Admin dashboard route */}
        <Route path="/dashboard" element={<Content />} />
        {/**Admin Users Registration route */}
        <Route path="/User/Registration" element={<UserRegistration />} />
        {/**Admin Staffs Registration route */}
        <Route path="/Staff/Registration" element={<StaffsRegistration />} />

        {/* for Admin Staffs view details */}
        <Route path="/Staff/View/details" element={<ViewStaffs />} />
        <Route
          path="/Staff/View/details/Edit/:staff_id"
          element={<EditStaffs />}
        />

        {/**Admin Passengers Registration route */}
        <Route
          path="/Passenger/Registration"
          element={<PassengersRegistration />}
        />

        {/* for Admin Passengers view details */}
        <Route path="/Passenger/View/details" element={<ViewPassengers />} />
        <Route
          path="Passenger/View/details/Edit/:passenger_id"
          element={<EditPassengers />}
        />
        {/**Admin Setting route */}
        <Route path="/Settings/" element={<Settings />} />
        {/* for Admin OTP verifaction */}
        <Route path="/Settings/change/password" element={<OtpVerification />} />

        {/* for Amdin User view details */}
        <Route path="/User/View/details" element={<ViewUsers />} />
        {/* for Admin User Edit */}
        <Route path="User/View/details/Edit/:user_id" element={<EditUser />} />
        {/*for Admin Profile View*/}
        <Route path="/profile/view" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default Sidebar;
