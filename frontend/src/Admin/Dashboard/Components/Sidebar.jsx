import { Routes, Route } from "react-router-dom";
import UserRegistration from "../../User";
import StaffsRegistration from "../../Staffs";
import PassengersRegistration from "../../Passengers";
import Settings from "../../Settings";
import ViewUsers from "../../User/view_users";
import ViewPassengers from "../../Passengers/view_passengers";
import ViewStaffs from "../../Staffs/view_staffs";
import "./sidebar.css";
import Content from "../Contents";
import { SidebarData } from "./Sidebardata";
// import Avatar from "react-avatar";
import img from "./user.png";
function Sidebar() {
  return (
    <div className="main-content">
      <div className="content">
        <div id="main-title">Airport Secuirty System</div>
        <div id="User-role-title">Admin</div>
        <div className="profile">
          {/* <Avatar src="./user.png" /> */}
          <img id="profile-image" alt="" src={img} />
          <div id="ProfileName">User Name</div>
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
        {/**Admin dashboard route */}
        <Route path="/dashboard" element={<Content />} />
        {/**Admin Users Registration route */}
        <Route path="/User/Registration" element={<UserRegistration />} />
        {/**Admin Staffs Registration route */}
        <Route
          path="/Staff/Registration"
          element={<StaffsRegistration />}
        />

        <Route 
          path="/Staff/View/details"
          element={<ViewStaffs />}
        />
        {/**Admin Passengers Registration route */}
        <Route
          path="/Passenger/Registration"
          element={<PassengersRegistration />}
        />

        <Route path="/Passenger/View/details"  element={<ViewPassengers />}/>
        {/**Admin Setting route */}
        <Route path="/Settings" element={<Settings />} />
        <Route path="/User/View/details" element={<ViewUsers />} />
      </Routes>
    </div>
  );
}

export default Sidebar;
