"use client";
import { useCart } from "@/hooks/useCart";
import SideDrawer from "./SideDrawer";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

const CartCount = () => {
  const { cartTotalQty } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
      <SideDrawer open={open} setOpen={setOpen} />
      <div className="text-3xl">
        <ShoppingBag />
      </div>
      <span className="absolute top-[-10px] right-[-10px] bg-slate-700 text-white h-5 w-5 rounded-full flex items-center justify-center text-sm">
        {cartTotalQty}
      </span>
    </div>
  );
};

export default CartCount;
