"use client";

import { ShoppingBag } from "lucide-react";

const CartClient = ({ currentUser }: any) => {
  console.log({ currentUser });

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
      <div></div>
    </div>
  );
};

export default CartClient;
