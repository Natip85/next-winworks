"use client";

import { useCart } from "@/hooks/useCart";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const CartClient = ({ currentUser }: any) => {
  console.log({ currentUser });
  const {
    cartProducts,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    cartTotalAmount,
  } = useCart();
  return (
    <div className="mx-auto mb-20 max-w-7xl px-4 md:mb-40 md:px-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="bg-teal-50 flex h-12 w-12 items-center justify-center rounded-full">
          <div>
            <ShoppingBag />
          </div>
        </span>
        <h1 className="text-xl md:text-4xl font-bold">Cart</h1>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg text-teal-600 font-bold">
          {cartProducts?.length} items
        </p>
        <div className="grid grid-cols-4 md:grid-cols-12 xl:max-w-screen-xl gap-6 md:gap-14">
          <div className="col-span-full lg:col-span-8 lg:row-start-1">
            <ul className="hidden grid-cols-8 px-4 md:grid">
              <li className="text-base col-span-5 font-bold">Products</li>
              <li className="text-base font-bold">Price</li>
              <li className="text-base font-bold">Quantity</li>
            </ul>
            <span className="text-base font-bold md:hidden">Products</span>
            <div className="h-[1px] w-full bg-gray-200 mt-2" />
            <ul>
              <li className="grid grid-cols-8 gap-y-4 border-b border-gray-200 px-4 py-3">
                <div className="col-span-6 md:col-span-5">
                  <Link href={"/"} className="flex gap-8">
                    <span className="relative block overflow-hidden h-16 w-20">
                      <Image
                        src={""}
                        alt={""}
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="my-0 object-cover transition-[scale,filter] duration-700"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: "0px",
                          color: "transparent",
                        }}
                      />
                    </span>
                  </Link>
                </div>
                <p className="text-inherit col-start-8 flex items-center md:col-start-auto">
                  $8.99
                </p>
                <div className="relative flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-[6px] col-span-3 col-start-4 row-start-2 max-w-[120px] py-1 md:col-span-1 md:col-start-auto md:row-start-auto md:mt-0 md:place-self-center">
                  <Button
                    variant={"link"}
                    size={"xs"}
                    className="hover:no-underline"
                  >
                    <span>-</span>
                  </Button>
                  <span className="text-sm w-5 py-px text-center font-bold">
                    4
                  </span>
                  <Button
                    variant={"link"}
                    size={"xs"}
                    className="hover:no-underline"
                  >
                    <span>+</span>
                  </Button>
                </div>
                <div className="col-start-8 row-start-2 flex items-center justify-end md:col-start-auto md:row-start-auto">
                  <Button variant={"ghost"} size={"xs"}>
                    <X />
                  </Button>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-span-full row-start-1 lg:col-span-4 lg:col-start-9 lg:row-auto">
            <span className="text-base font-bold">Order summary:</span>
            <div className="h-[1px] w-full bg-gray-200 mb-4 mt-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-teal-600">Subtotal:</span>
              <span className="text-xl md:text-2xl font-bold">$44.95</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-teal-600">Shipping:</span>
              <span className="text-[.6rem] text-right">
                Taxes and shipping fee will be calculated at checkout
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Button>Checkout</Button>
              <Button variant={"outline"}>Continue shopping</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
