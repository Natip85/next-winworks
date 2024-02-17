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
import { FaUser } from "react-icons/fa";
import { GoGraph } from "react-icons/go";

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
    route: "/store",
    label: "Live Store",
  },
];
