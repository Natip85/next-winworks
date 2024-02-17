"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { sidebarLinks } from "@/constants/sidebarLinks";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <section className="sticky top-0 left-0 bg-[#EBEBEB] pt-[6rem] flex h-screen flex-col justify-between overflow-auto border-r border-r-dark-4 max-md:hidden w-[200px] max-lg:w-[100px] px-5 min-w-[100px]">
      <div className="flex w-full flex-1 flex-col gap-2">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname!.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              target={link.label === "Live Store" ? "_blank" : undefined}
              className={cn(
                "flex gap-3 items-center max-lg:justify-center hover:bg-neutral-300 p-1 pl-2 rounded-lg jusify-center",
                isActive ? "bg-gray-100" : ""
              )}
            >
              <span>{isActive ? link.icon : link.iconActive}</span>
              <p className="max-lg:hidden text-m">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
