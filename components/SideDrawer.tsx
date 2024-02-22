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
import { useCallback, useState } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";
import { Product, Variant } from "@prisma/client";
interface SideDrawerProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  variant?: any;
}
const SideDrawer = ({ open, setOpen, variant }: SideDrawerProps) => {
  const router = useRouter();
  const {
    cartProducts,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    cartTotalAmount,
  } = useCart();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col h-screen">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag /> Mini cart
              </div>
              <DrawerClose asChild>
                <Button type="button" variant="link">
                  <X />
                </Button>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 overflow-hidden bg-white pt-2 sm:pt-6">
            <p className="text-sm text-teal-600 font-bold">
              {cartProducts?.length} items
            </p>
            <div>
              <ul>
                {cartProducts?.map((product, index) => (
                  <li key={index}>
                    <div className="flex justify-evenly gap-4 pb-[10px] pt-2">
                      <Link href={"/"}>
                        <div className="aspect-square w-full relative overflow-hidden h-[75px]">
                          <Image
                            src={product.images[0].url}
                            alt="prod img"
                            priority
                            fill
                            sizes="30"
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col justify-between max-w-[200px]">
                        <p>{product.title}</p>
                        <p>{product.variant[0]?.title}</p>
                        <div className="flex items-center justify-center gap-8">
                          <div className="flex items-center border">
                            <Button
                              type="button"
                              variant={"ghost"}
                              className="h-[25px] "
                              onClick={() => handleCartQtyDecrease(product)}
                            >
                              -
                            </Button>
                            <div className="flex justify-center w-[25px] ">
                              {product.quantity}
                            </div>
                            <Button
                              type="button"
                              variant={"ghost"}
                              className="h-[25px] "
                              onClick={() => handleCartQtyIncrease(product)}
                            >
                              +
                            </Button>
                          </div>
                          <span>
                            {formatPrice(product.price * product.quantity)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Button
                          size={"xs"}
                          variant="outline"
                          onClick={() => handleRemoveProductFromCart(product)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <DrawerFooter className="mb-10 gap-4">
            <Button onClick={() => router.push("/cart")}>View cart</Button>
            <DrawerClose asChild>
              <Button onClick={() => router.push("/store")} variant="outline">
                Continue shopping
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
