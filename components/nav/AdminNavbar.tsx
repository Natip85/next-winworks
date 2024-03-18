"use client";
import Image from "next/image";
import NavMenu from "./NavMenu";
import { useRouter } from "next/navigation";
import Container from "../Container";
import { useEffect, useRef, useState } from "react";
import SearchMenu from "../SearchMenu";
import { Order, Product } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  const [openSearch, setOpenSearch] = useState(false);
  const [openSearch2, setOpenSearch2] = useState(false);

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
          <div className="sm:hidden">
            <Drawer open={openSearch2} onOpenChange={setOpenSearch2}>
              <DrawerTrigger
                className="flex items-center gap-1 justify-start border border-gray-500 hover:border-gray-100 text-muted-foreground rounded-md p-1"
                asChild
              >
                <Button
                  variant={"link"}
                  size={"sm"}
                  className="flex items-center gap-1 justify-start border border-gray-500 hover:border-gray-100 text-muted-foreground hover:no-underline px-3"
                >
                  <Search className="size-4" /> Search
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-3">
                <div>
                  <div className="flex items-center justify-end">
                    <DrawerClose>
                      <Button variant="outline" size={"xs"}>
                        <X />
                      </Button>
                    </DrawerClose>
                  </div>
                  <SearchMenu
                    products={products}
                    orders={orders}
                    customers={customers}
                    onClose={() => setOpenSearch2(false)}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="hidden sm:flex">
            <Popover open={openSearch} onOpenChange={setOpenSearch}>
              <PopoverTrigger
                asChild
                className="w-[200px] md:w-[400px] xl:w-[500px]"
              >
                <Button
                  variant={"link"}
                  className="flex items-center gap-3 justify-start border border-gray-500 hover:border-gray-100 text-muted-foreground hover:no-underline"
                >
                  <Search className="size-4" /> <span>Search</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] xl:w-[500px]">
                <SearchMenu
                  products={products}
                  orders={orders}
                  customers={customers}
                  onClose={() => setOpenSearch(false)}
                />
              </PopoverContent>
            </Popover>
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
