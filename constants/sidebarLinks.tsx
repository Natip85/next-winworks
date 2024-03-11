import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineAppstore,
  AiOutlineUser,
  AiOutlineAreaChart,
  AiOutlineShop,
  AiFillHome,
  AiFillShopping,
  AiFillAppstore,
  AiFillShop,
} from "react-icons/ai";
import { BsArchive } from "react-icons/bs";
import { FaArchive, FaFileArchive, FaUser, FaUserCircle } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { IoLocation } from "react-icons/io5";

export const sidebarLinks = [
  {
    icon: <AiOutlineHome size={20} />,
    iconActive: <AiFillHome size={20} />,
    route: "/home",
    label: "Home",
  },
  {
    icon: <AiOutlineShopping size={20} />,
    iconActive: <AiFillShopping size={20} />,
    route: "/orders",
    label: "Orders",
  },
  {
    icon: <AiOutlineAppstore size={20} />,
    iconActive: <AiFillAppstore size={20} />,
    route: "/products",
    label: "Products",
  },
  {
    icon: <AiOutlineUser size={20} />,
    iconActive: <FaUser size={20} />,
    route: "/customers",
    label: "Customers",
  },
  {
    icon: <GoGraph size={20} />,
    iconActive: <AiOutlineAreaChart size={20} />,
    route: "/analytics",
    label: "Analytics",
  },
  {
    icon: <AiOutlineShop size={20} />,
    iconActive: <AiFillShop size={20} />,
    route: "/",
    label: "Live Store",
  },
];
export const profileMenuLinks = [
  {
    icon: <FaUserCircle size={20} />,
    iconActive: <FaRegCircleUser size={20} />,
    route: "/dashboard/details",
    label: "Account Details",
  },
  {
    icon: <FaArchive size={20} />,
    iconActive: <BsArchive size={20} />,
    route: "/dashboard/history",
    label: "Order History",
  },
  {
    icon: <IoLocation size={20} />,
    iconActive: <IoLocationOutline size={20} />,
    route: "/dashboard/addresses",
    label: "View Addresses",
  },
];
