import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import for Admin control to setup router
import Sidebar from "../Admin/Dashboard/Components";
// import for Users control to setup router
import Usersidebar from "../Users/Dashboard/Components";
// import for login page control to setup router
import { Login } from "../login";
import { UserLogin } from "../Users/login/login";
import { useSelector } from "react-redux/es/hooks/useSelector";
import PassengerDetails from "../flight_details";
import StaffsDetails from "../Staff_details/staff_details";
function PrivateRoute({ element, authenticated, redirectTo }) {
  return authenticated ? (
    element
  ) : (
    <Navigate
      to={redirectTo}
      replace
      state={{ from: window.location.pathname }}
    />
  );
}

function Url() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* login page route */}
        <Route
          path="/"
          element={
            <PrivateRoute
              element={<Login />}
              authenticated={!isAuthenticated}
              redirectTo="/Admin/dashboard/"
            />
          }
        />

        {/* Admin controls route */}
        <Route
          path="/Admin/*"
          element={
            <PrivateRoute
              element={<Sidebar />}
              authenticated={!!isAuthenticated}
              redirectTo="/"
            />
          }
        />

        <Route
          path="/User/login/"
          element={<UserLogin />}
          authenticated={!isAuthenticated}
          redirectTo="/User/dashboard/"
        />

        {/* Users controls route */}
        <Route
          path="/User/*"
          element={<Usersidebar />}
          authenticated={!!isAuthenticated}
          redirectTo="/User/login/"
        />

        <Route
          path="/passenger/flight/details/"
          element={<PassengerDetails />}
        />

        <Route path="/staff/details/" element={<StaffsDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Url;
