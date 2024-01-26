import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import SettingsIcon from "@mui/icons-material/Settings";
export const SidebarData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/Admin/dashboard",
  },
  {
    title: "Users",
    icon: <PeopleIcon />,
    link: "/Admin/User/Registration",
  },
  {
    title: "Staffs",
    icon: <CoPresentIcon />,
    link: "/Admin/Staff/Registration",
  },
  {
    title: "Passengers",
    icon: <DirectionsWalkIcon />,
    link: "/Admin/Passenger/Registration",
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    link: "/Admin/Settings",
  },
];
