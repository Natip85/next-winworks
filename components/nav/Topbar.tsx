"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { TopbarNavMenu } from "./TopbarNavMenu";
import SideDrawer from "../SideDrawer";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/actions/getCurrentUser";
import CartCount from "../CartCount";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
interface TopbarProps {
  user: any;
}
const Topbar = ({ user }: TopbarProps) => {
  const { cartTotalQty } = useCart();

  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white py-2 lg:py-4">
      <div className="mx-auto box-border flex w-full max-w-screen-xl items-center justify-between px-3 lg:px-8">
        <Link href={"/"}>
          <div className="relative">
            <Image
              src={"/logo.svg"}
              alt="logo"
              width="30"
              height="30"
              className="aspect-square"
            />
          </div>
        </Link>
        <nav className="z-10 max-w-max flex-1 items-center justify-center hidden lg:block">
          <div className="relative">
            <ul className="flex flex-1 list-none items-center justify-center space-x-1">
              <TopbarNavMenu />
            </ul>
          </div>
        </nav>
        <div className="flex justify-between items-center gap-4">
          {user ? (
            <div>
              <Link href={"/dashboard"} className="p-0">
                <User className="hover:text-teal-700" />
              </Link>
            </div>
          ) : (
            <div>
              <Link href={"/auth"} className="p-0">
                <User />
              </Link>
            </div>
          )}

          <div>
            <Button
              variant={"link"}
              onClick={() => setOpen(!open)}
              className="relative"
            >
              <span className="absolute top-[-8px] right-[3px] rounded-full p-0 bg-teal-700 size-5 text-white">
                {cartTotalQty}
              </span>
              <ShoppingBag />
            </Button>
            <SideDrawer open={open} setOpen={setOpen} />
          </div>
          {user?.role === "ADMIN" && (
            <Link href={"/home"} className="border rounded-md py-2 px-4">
              Go to admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
