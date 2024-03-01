"use client";

import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

interface CartClientProps {
  currentUser: any;
  products: Product[];
}
const CartClient = ({ currentUser, products }: CartClientProps) => {
  const router = useRouter();
  const {
    cartProducts,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    cartTotalAmount,
  } = useCart();
  return (
    <div className="m-0 p-0">
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
              <Separator className="my-3" />
              {cartProducts?.map((product) => (
                <ul key={product.id}>
                  <li className="grid grid-cols-8 gap-y-4 border-b border-gray-200 px-4 py-3">
                    <div className="col-span-6 md:col-span-5">
                      <Link href={"/"} className="flex gap-8">
                        <span className="relative block overflow-hidden size-20">
                          <Image
                            src={product.images[0]?.url}
                            alt={product.title}
                            fill
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
                        <div className="flex flex-col gap-[6px]">
                          <span className="text-base font-bold">
                            {product.title}
                          </span>
                          <ul className="flex flex-wrap items-center gap-1">
                            <li className="text-gray-600">
                              <div className="outline-transparent flex cursor-pointer items-center gap-[6px]">
                                <div
                                  className="relative rounded-full outline-current w-[14px] h-[14px]"
                                  style={{
                                    backgroundColor:
                                      product.options[0]?.name.toLowerCase(),
                                  }}
                                />
                                <p className="text-xs">
                                  {product.options[0]?.name}
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Link>
                    </div>
                    <p className="text-inherit col-start-8 flex items-center md:col-start-auto">
                      {formatPrice(product.price)}
                    </p>
                    <div className="relative flex items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-[6px] col-span-3 col-start-4 row-start-2 max-w-[120px] py-1 md:col-span-1 md:col-start-auto md:row-start-auto md:mt-0 md:place-self-center">
                      <Button
                        onClick={() => handleCartQtyDecrease(product)}
                        variant={"link"}
                        size={"xs"}
                        className="hover:no-underline"
                      >
                        <span>
                          <Minus className="size-4" />
                        </span>
                      </Button>
                      <span className="text-sm w-5 py-px text-center font-bold">
                        {product.quantity}
                      </span>
                      <Button
                        onClick={() => handleCartQtyIncrease(product)}
                        variant={"link"}
                        size={"xs"}
                        className="hover:no-underline"
                      >
                        <span>
                          <Plus className="size-4" />
                        </span>
                      </Button>
                    </div>
                    <div className="col-start-8 row-start-2 flex items-center justify-end md:col-start-auto md:row-start-auto">
                      <Button
                        onClick={() => handleRemoveProductFromCart(product)}
                        variant={"ghost"}
                        size={"xs"}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
            <div className="col-span-full row-start-1 lg:col-span-4 lg:col-start-9 lg:row-auto">
              <span className="text-base font-bold">Order summary:</span>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-600">Subtotal:</span>
                <span className="text-xl md:text-2xl font-bold">
                  {formatPrice(cartTotalAmount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-teal-600">Shipping:</span>
                <span className="text-[.6rem] text-right">
                  Taxes and shipping fee will be calculated at checkout
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <Button
                  onClick={() => {
                    currentUser
                      ? router.push("/checkout")
                      : router.push("/auth");
                  }}
                >
                  {currentUser ? "Checkout" : "Login to checkout"}
                </Button>
                <Button
                  onClick={() => router.push("/store")}
                  variant={"outline"}
                >
                  Continue shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8">
          <h3 className="text-3xl text-teal-700 mb-6 text-center font-bold">
            Add-on Accesories
          </h3>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {products.map((product) => (
              <div
                onClick={() => {}}
                key={product.id}
                className="w-full cursor-pointer"
              >
                <div className="relative flex w-full flex-col transition-transform hover:scale-105">
                  <span className="aspect-video block relative  w-full overflow-hidden rounded-xl">
                    <Image
                      src={product.images[0]?.url}
                      alt={product.title}
                      fill
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        inset: "0px",
                        color: "transparent",
                      }}
                    />
                  </span>
                  <span className="text-base mt-[6px] inline-block font-bold text-center">
                    {product.title}
                  </span>
                  <span className="text-base mt-[2px] inline-block font-bold text-gray-500 text-center">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
