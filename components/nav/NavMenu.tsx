import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LucideLogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import NavbarAvatar from "./NavbarAvatar";
import { signOut } from "next-auth/react";
import { Separator } from "../ui/separator";
interface NavMenuProps {
  currentUser: any | null;
}
const NavMenu = ({ currentUser }: NavMenuProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-[150px] bg-slate-800 hover:bg-slate-700 rounded p-[1px] pl-3 cursor-pointer justify-between items-center">
          <span className="text-white text-[12px]">{currentUser?.name}</span>
          <div className="rounded">
            <NavbarAvatar
              src={currentUser?.image}
              currentUser={currentUser?.name}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuItem
          onClick={() => router.push("/manage-account")}
          className="cursor-pointer flex gap-2 items-center"
        >
          <Settings size={15} /> <span>Manage account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer flex gap-2 items-center"
        >
          <Settings size={15} /> <span>Settings</span>
        </DropdownMenuItem>
        <Separator />
        <div className="p-2">
          <p className="text-sm font-semibold">{currentUser?.name}</p>
          <p className="text-xs">{currentUser?.email}</p>
        </div>
        <DropdownMenuItem
          onClick={() => {
            signOut({ redirect: true, callbackUrl: "/" });
          }}
          className="cursor-pointer flex gap-2 items-center"
        >
          <LucideLogOut size={15} /> <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavMenu;
