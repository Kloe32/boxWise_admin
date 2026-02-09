import { LuLayoutDashboard } from "react-icons/lu";
import { FaBoxes } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
export const sideBarItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: <LuLayoutDashboard size={15} />,
  },
  {
    name: "Manage Units",
    path: "/storage-units",
    icon: <FaBoxes size={15} />,
  },
  {
    name: "Bookings & Payments",
    path: "/bookings",
    icon: <FaRegCalendarCheck size={15} />,
  },
];
