"use client";
import { Order, Product } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
interface SearchMenuProps {
  products: Product[];
  orders: Order[];
  closeDropdown: () => void;
}
const SearchMenu = ({ products, orders, closeDropdown }: SearchMenuProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedSearchTerm = e.target.value.trim();

    setSearchTerm(trimmedSearchTerm);
  };
  return (
    <div>
      <div className="mb-3 sticky top-0 bg-white pt-3">
        <div className="relative flex items-center">
          <Search className="absolute left-2 size-5" />
          <Input
            onChange={handleSearchChange}
            placeholder="Search"
            className="pl-8"
          />
        </div>
      </div>
      <Tabs defaultValue="order">
        <TabsList className="w-full h-[15px]">
          <TabsTrigger value="order" className="w-full h-[15px] text-xs">
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers" className="w-full h-[15px] text-xs">
            Customers
          </TabsTrigger>
          <TabsTrigger value="products" className="w-full h-[15px] text-xs">
            Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="order">
          <div className="flex flex-col gap-2 p-3">
            {searchTerm === "" ? (
              <p className="text-center text-2xl">Search anything</p>
            ) : (
              <div className="flex flex-col gap-2 bg-red-500">
                {filteredOrders.length === 0 && (
                  <div className="text-center text-2xl">No results found.</div>
                )}
                {filteredOrders.map((order) => (
                  <div key={order.id}>
                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-yellow-500"
                    >
                      <span>{order.id}</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="customers">
          <h2 className="text-center text-2xl p-3">Customers</h2>
        </TabsContent>
        <TabsContent value="products">
          <div className="flex flex-col gap-2 p-3">
            {searchTerm === "" ? (
              <p className="text-center text-2xl">Search anything</p>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredProducts.length === 0 && (
                  <div className="text-center text-2xl">No results found.</div>
                )}
                {filteredProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <span>{product.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchMenu;
