"use client";
import { Order, Product } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, User } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineShopping } from "react-icons/ai";
import { Badge } from "./ui/badge";
import moment from "moment";
import Image from "next/image";
interface SearchMenuProps {
  products: Product[];
  orders: Order[];
  customers: any;
}
const SearchMenu = ({ products, orders, customers }: SearchMenuProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCustomers = customers.filter(
    (customer: any) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="flex flex-col items-center justify-center gap-3 p-5">
                <Search className="size-20" />
                <span className="text-2xl">Search all orders</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredOrders.length === 0 && (
                  <div className="text-center text-2xl">No results found.</div>
                )}
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    <AiOutlineShopping size={20} />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {/* {order?.id.substring(0, 6)}... */}
                          {order?.orderNumber}
                        </span>
                        <Badge variant={"secondary"}>
                          {order?.paymentStatus === "complete"
                            ? "paid"
                            : "pending"}
                        </Badge>
                        <Badge variant={"secondary"}>
                          {order?.fulfillmentStatus}
                        </Badge>
                      </div>
                      <div>
                        <span className="flex items-center gap-1">
                          {order.shippingAddress?.fullName}{" "}
                          <span className="text-lg">&middot;</span>
                          {" placed on "}
                          {moment(order?.createdAt).format("MMMM Do YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="customers">
          <div className="flex flex-col gap-2 p-3">
            {searchTerm === "" ? (
              <div className="flex flex-col items-center justify-center gap-3 p-5">
                <Search className="size-20" />
                <span className="text-2xl">Search all customers</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredCustomers.length === 0 && (
                  <div className="text-center text-2xl">No results found.</div>
                )}
                {filteredCustomers.map((customer: any) => (
                  <div
                    key={customer?.id}
                    className="p-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
                    onClick={() => router.push(`/customers/${customer?.id}`)}
                  >
                    <User className="size-5" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{customer?.name}</span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1">
                          {customer?.email}{" "}
                          <span className="text-lg">&middot;</span>
                          {customer?.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="products">
          <div className="flex flex-col gap-2 p-3">
            {searchTerm === "" ? (
              <div className="flex flex-col items-center justify-center gap-3 p-5">
                <Search className="size-20" />
                <span className="text-2xl">Search all products</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredProducts.length === 0 && (
                  <div className="text-center text-2xl">No results found.</div>
                )}
                {filteredProducts.map((product) => (
                  <div
                    key={product?.id}
                    className="p-2 hover:bg-gray-200 rounded-md flex items-center gap-3"
                    onClick={() => router.push(`/products/${product?.id}`)}
                  >
                    <div className="relative block overflow-hidden size-10">
                      <Image
                        src={product.images[0]?.url}
                        alt={product.title}
                        fill
                        className="my-0 object-cover transition-[scale,filter] duration-700 rounded-md"
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: "0px",
                          color: "transparent",
                        }}
                      />
                    </div>
                    <div className="font-semibold">{product.title}</div>
                  </div>
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
