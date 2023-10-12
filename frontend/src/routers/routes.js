import { BrowserRouter, Routes, Route } from "react-router-dom";
// import for Admin control to setup router
import Sidebar from "../Admin/Dashboard/Components";
// import for Users control to setup router
import Usersidebar from "../Users/Dashboard/Components";
// import for login page control to setup router
import { Login } from "../login";

function Url() {
  return (
    <BrowserRouter>
      <Routes>
        {/* login page route */}
        <Route path="/" element={<Login />} />

        {/* Admin controls route */}
        <Route path="/Admin/*" element={<Sidebar />} />

        {/* Users controls route */}
        <Route path="/User/*" element={<Usersidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Url;
