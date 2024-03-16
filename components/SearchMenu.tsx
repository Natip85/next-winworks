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
}
const SearchMenu = ({ products, orders }: SearchMenuProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
          <div className="flex flex-col gap-2">
            {filteredOrders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <span>{order.id}</span>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="customers">
          <h2 className="text-center text-2xl">Customers</h2>
        </TabsContent>
        <TabsContent value="products">
          <div className="flex flex-col gap-2">
            {filteredProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <span>{product.title}</span>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchMenu;
