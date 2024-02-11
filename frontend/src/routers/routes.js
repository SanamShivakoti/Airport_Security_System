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
import PasswordResetPage from "../Admin/forget_password/forget_passord";
import UserPasswordResetPage from "../Users/forget_password/forget_password_user";
import StaffsDetails from "../Staff_details/staff_details";
// import { getToken, removeToken } from "../services/LocalStorageService";
import { getToken, removeToken } from "../services/LocalStorageService";
import { removeUserToken } from "../features/authSlice";
import { useDispatch } from "react-redux";

function AdminRoute({ element, authenticated, redirectTo, userRole }) {
  const dispatch = useDispatch();

  if (authenticated) {
    if (userRole === "User") {
      dispatch(removeUserToken());
      removeToken();

      return (
        <Navigate
          to={redirectTo}
          replace
          state={{ from: window.location.pathname }}
        />
      );
    }
  } else {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }
  return element;
}

function UserRoute({ element, authenticated, redirectTo, userRole }) {
  const dispatch = useDispatch();

  if (authenticated) {
    if (userRole === "Admin") {
      dispatch(removeUserToken());
      removeToken();

      return (
        <Navigate
          to={redirectTo}
          replace
          state={{ from: window.location.pathname }}
        />
      );
    }
  } else {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }
  return element;
}

function PrivateRoute({
  element,
  authenticated,
  redirectTo,
  isAdminRoute,
  role,
}) {
  const shouldRedirect =
    (!isAdminRoute && role === "Admin") || (isAdminRoute && role === "User");
  if (!authenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

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
  const { isAuthenticated, UserRole } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* login page route */}
        <Route
          path="/"
          element={
            <AdminRoute
              element={<Login />}
              authenticated={!isAuthenticated}
              isAdminRoute={true}
              userRole={UserRole}
              redirectTo="/Admin/dashboard/"
            />
          }
        />

        {/* Admin controls route */}
        <Route
          path="/Admin/*"
          element={
            <AdminRoute
              element={<Sidebar />}
              authenticated={isAuthenticated}
              isAdminRoute={true}
              userRole={UserRole}
              redirectTo="/"
            />
          }
        />

        <Route
          path="/User/login/"
          element={
            <UserRoute
              element={<UserLogin />}
              authenticated={!isAuthenticated}
              isAdminRoute={false}
              userRole={UserRole}
              redirectTo="/User/dashboard/"
            />
          }
        />

        {/* Users controls route */}
        <Route
          path="/User/*"
          element={
            <UserRoute
              element={<Usersidebar />}
              authenticated={isAuthenticated}
              isAdminRoute={false}
              userRole={UserRole}
              redirectTo="/User/login/"
            />
          }
        />

        <Route
          path="/passenger/flight/details/"
          element={<PassengerDetails />}
        />

        <Route path="/staff/details/" element={<StaffsDetails />} />
        <Route
          path="/Admin/forget/password/reset/"
          element={<PasswordResetPage />}
        />
        <Route
          path="/User/forget/password/reset/"
          element={<UserPasswordResetPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Url;
