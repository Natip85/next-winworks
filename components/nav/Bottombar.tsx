"use client";
import Link from "next/link";
import React from "react";
import { sidebarLinks } from "@/constants/sidebarLinks";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Bottombar = () => {
  const pathname = usePathname();

  return (
    <section className="fixed bottom-0 z-10 w-full rounded-t-3xl sm:bg-gray-200 p-4 backdrop-blur-lg xs:px-7 md:hidden">
      <div className="flex items-center justify-between gap-3 xs:gap-5">
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
                "flex flex-col gap-3 items-center max-lg:justify-center hover:bg-neutral-300 p-1 rounded-lg jusify-center",
                isActive ? "bg-gray-100" : ""
              )}
            >
              <span>{isActive ? link.icon : link.iconActive}</span>
              <p className="text-subtle-medium max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
