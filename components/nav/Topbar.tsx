"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import { TopbarNavMenu } from "./TopbarNavMenu";
import SideDrawer from "../SideDrawer";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter();
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
          <div>
            <Button variant={"ghost"} className="p-0">
              <User />
            </Button>
          </div>
          <div>
            <Button variant={"ghost"} className="p-0">
              <SideDrawer />
            </Button>
          </div>
          <Button onClick={() => router.push("/home")}>Go to admin</Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
