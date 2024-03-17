"use client";
import Image from "next/image";
import NavMenu from "./NavMenu";
import { useRouter } from "next/navigation";
import Container from "../Container";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchMenu from "../SearchMenu";
import { Order, Product } from "@prisma/client";
interface AdminNavbarProps {
  currentUser: any | null;
  products: Product[];
  orders: Order[];
  customers: any;
}
const AdminNavbar = ({
  currentUser,
  products,
  orders,
  customers,
}: AdminNavbarProps) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="fixed z-50 top-0 right-0 left-0 bg-black">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            <Image
              src={"/logo.svg"}
              alt="logo"
              width="30"
              height="30"
              className="aspect-square"
            />
            <div className={"font-bold text-xl  text-white"}>NextWinWorks</div>
          </div>
          <div
            onClick={() => setIsDropdownOpen(true)}
            ref={dropdownRef}
            className="relative hidden md:flex bg-gray-900 p-2 items-center gap-2 text-sm border border-gray-500 hover:border-gray-100 rounded-lg w-[400px] xl:w-[500px] hover:cursor-pointer "
          >
            <Search className="size-5 text-gray-500" />
            <span className="text-muted-foreground">Search</span>
            {isDropdownOpen && (
              <div className="absolute bg-white w-ful -top-1 w-[600px] -left-1 h-[300px] rounded-md p-3 pt-0 overflow-y-auto shadow-md">
                <SearchMenu
                  products={products}
                  orders={orders}
                  customers={customers}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <NavMenu currentUser={currentUser} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminNavbar;
