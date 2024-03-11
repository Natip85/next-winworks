"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Archive,
  ChevronRight,
  MapPin,
  Power,
  UserCircle2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { profileMenuLinks } from "@/constants/sidebarLinks";

const ProfileMenu = () => {
  const pathname = usePathname();
  return (
    <div className="mt-7 flex w-full flex-col lg:mt-0 lg:w-[280px] lg:min-w-[280px]">
      {/* <Link
        href={"/dashboard/details"}
        className="border-b flex items-center justify-between"
      >
        <span className="flex gap-3 items-center">
          <UserCircle2 className="size-5" /> Account Details
        </span>
        <span>
          <ChevronRight className="size-5" />
        </span>
      </Link>
      <Link
        href={"/dashboard/history"}
        className="border-b flex items-center justify-between"
      >
        <span className="flex gap-3 items-center">
          <Archive className="size-5" /> Order History
        </span>
        <span>
          <ChevronRight className="size-5" />
        </span>
      </Link>
      <Link
        href={"/dashboard/addresses"}
        className="border-b flex items-center justify-between"
      >
        <span className="flex gap-3 items-center">
          <MapPin className="size-5" /> View Addresses
        </span>
        <span>
          <ChevronRight className="size-5" />
        </span>
      </Link> */}
      {profileMenuLinks.map((link) => {
        const isActive =
          (pathname!.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;
        return (
          <Link
            href={link.route}
            key={link.label}
            className={cn(
              "border-b flex items-center justify-between p-3",
              isActive ? "text-teal-700" : ""
            )}
          >
            <span className="flex gap-3 items-center">
              {isActive ? link.icon : link.iconActive} {link.label}
            </span>
            <span>
              <ChevronRight className="size-5" />
            </span>
          </Link>
        );
      })}
      <Button
        onClick={() => signOut({ redirect: true, callbackUrl: "/auth" })}
        variant={"link"}
        className="flex justify-start hover:text-red-600 hover:no-underline w-fit"
      >
        <Power className="size-4 mr-2 " />
        Logout
      </Button>
    </div>
  );
};

export default ProfileMenu;
