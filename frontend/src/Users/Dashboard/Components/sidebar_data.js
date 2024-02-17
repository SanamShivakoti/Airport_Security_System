import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ViewListIcon from "@mui/icons-material/ViewList";
import SettingsIcon from "@mui/icons-material/Settings";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
export const sidebar_data = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/User/dashboard",
  },
  {
    title: "Passengers",
    icon: <DirectionsWalkIcon />,
    link: "/User/Passenger/Registration",
  },
  {
    title: "View Passengers",
    icon: <ViewListIcon />,
    link: "/User/View/Passengers",
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    link: "/User/Settings",
  },
  {
    title: "Terms and Conditions",
    icon: <ReadMoreIcon />,
    link: "/User/terms/view",
  },
];
