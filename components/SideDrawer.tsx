"use client";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

const SideDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <ShoppingBag />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag /> Mini cart
              </div>
              <DrawerClose asChild>
                <Button variant="link">
                  <X />
                </Button>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">Put stuff here</div>
          <DrawerFooter>
            <Button>Checkout</Button>
            <DrawerClose asChild>
              <Button variant="outline">Continue shopping</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
