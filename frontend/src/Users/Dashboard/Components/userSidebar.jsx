import { Routes, Route } from "react-router-dom";
import PassengerRegistration from "../../Passengers";
import ViewPassengers from "../../View_passengers";
import UserSettings from "../../Settings";
import "./sidebar.css";
import Content from "../Contents";
import { sidebar_data } from "./sidebar_data";
// import Avatar from "react-avatar";
import img from "./user.png";
function Usersidebar() {
  return (
    <div className="main-content">
      <div className="content">
        <div id="main-title">Airport Secuirty System</div>
        <div id="User-role-title">User</div>
        <div className="profile">
          {/* <Avatar src="./user.png" /> */}
          <img id="profile-image" alt="" src={img} />
          <div id="ProfileName">User Name</div>
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
               onClick={() => {
                 window.location.pathname = val.link;
               }}
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
          element={<PassengerRegistration />}
        />

        {/**User View Passengers route */}
        <Route path="/View/Passengers" element={<ViewPassengers />} />

        {/**User Setting Page route */}
        <Route path="/Settings" element={<UserSettings />} />
      </Routes>
    </div>
  );
}

export default Usersidebar;
