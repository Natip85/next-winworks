"use client";
import { FulfillmentStatusLabel, Order, Product, User } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  ChevronsUpDown,
  Clipboard,
  Edit3Icon,
  Trash2,
  X,
} from "lucide-react";
import { FaTruckFast } from "react-icons/fa6";
import { CiBookmarkCheck } from "react-icons/ci";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { Input } from "../ui/input";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import AddCustomerToOrder from "./AddCustomerToOrder";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { Badge } from "../ui/badge";
import moment from "moment";
import EditCustomerForm from "../customer/EditCustomerForm";
import Modal from "../Modal";

interface AddOrderFormProps {
  order: OrderWithUser | null;
  products: Product[];
  users: any;
}
export type OrderWithUser = Order & {
  user: User;
};

export type userWithOrders = User & {
  orders: Order[];
};
const AddOrderForm = ({ order, products, users }: AddOrderFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<userWithOrders>();
  console.log("Order>>>", order);
  console.log("Users>>>", users);

  const handleCheckboxChange = (productId: string) => {
    const isSelected = selectedProducts.some(
      (product) => product.id === productId
    );
    if (isSelected) {
      setSelectedProducts(
        selectedProducts.filter((product) => product.id !== productId)
      );
    } else {
      const productToAdd = products.find((product) => product.id === productId);
      if (productToAdd) {
        setSelectedProducts([...selectedProducts, productToAdd]);
      }
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProductQuantities((prevState) => ({
      ...prevState,
      [productId]: quantity,
    }));
  };

  const total = selectedProducts.reduce((acc, prod) => {
    const quantity = productQuantities[prod.id] || 1;
    return acc + prod.price * quantity;
  }, 0);
  const finalTotal = total * 100;

  const onSubmit = () => {
    setIsLoading(true);
    const finalData = {
      email: selectedCustomer?.email,
      fulfillmentStatus: FulfillmentStatusLabel.UNFULFILLED,
      paymentStatus: "complete",
      itemCount: selectedProducts.length,
      shippingAddress: selectedCustomer?.addresses[0],
      shippingPrice: 0,
      subtotalPrice: finalTotal,
      currency: "usd",
      taxPrice: 0,
      totalDiscounts: 0,
      totalPrice: finalTotal,
      deliveryStatus: "dispatched",
      products: selectedProducts.map((product) => ({
        ...product,
        quantity: productQuantities[product.id] || 1,
        variant: {},
      })),
      paymentIntentId: "123intent",
      userId: selectedCustomer?.id,
    };

    axios
      .post("/api/order", finalData)
      .then((res) => {
        toast({
          variant: "success",
          description: "Order created",
        });
        router.push(`/orders/${res.data.id}`);
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Oops!something went wrong",
        });
      });
    // .finally(() => setIsLoading(false));
  };

  const handleSetSelectedCustomer = (val: any) => {
    setSelectedCustomer(val);
  };

  const handleCopyEmail = () => {
    if (selectedCustomer && selectedCustomer.email) {
      navigator.clipboard.writeText(selectedCustomer.email.toString());
      toast({
        variant: "success",
        description: "Copied to clipboard",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Email is not available",
      });
    }
    if (order?.email) {
      navigator.clipboard.writeText(order.email.toString());
      toast({
        variant: "success",
        description: "Copied to clipboard",
      });
    }
  };
  const handleDialogOpen = () => {
    setDialogOpen((prev) => !prev);
  };
  return (
    <div>
      <div className="flex flex-col max-w-[950px] gap-3 mx-auto">
        <div className="flex items-center mb-5">
          <Modal
            icon={<ArrowLeft className="h-4 w-4" />}
            onConfirm={() => router.push("/orders")}
            cancelTitle="Cancel"
            confirmTitle="Leave"
            title="Leave page?"
            description={`Are you sure you want to leave this page? All unsaved data will be lost.`}
            btnClasses="rounded-md hover:bg-gray-300 p-2"
          />
          <div className="ml-2">
            {order ? (
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-2xl">{order.id}</h2>
                  <span>
                    <Badge variant={"outline"}>
                      {order.paymentStatus === "complete" ? "paid" : "pending"}
                    </Badge>
                  </span>
                  <span>
                    <Badge variant={"outline"}>{order.fulfillmentStatus}</Badge>
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {moment(order?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </div>
              </div>
            ) : (
              <h2 className="font-bold text-2xl">Create order</h2>
            )}
          </div>
        </div>
        {order ? (
          <div className="md:flex gap-5">
            <div className="md:w-2/3">
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <Badge
                  variant={
                    order.fulfillmentStatus === FulfillmentStatusLabel.FULFILLED
                      ? "success"
                      : "secondary"
                  }
                  className="m-2 py-2 px-3 flex items-center gap-1 w-fit"
                >
                  <FaTruckFast className="size-4" /> {order.fulfillmentStatus}
                </Badge>
                <div className="border p-3 rounded-md rounded-b-none flex flex-col">
                  <span className="text-muted-foreground">DHL Express</span>
                  <span className="text-sky-700 underline hover:cursor-pointer">
                    6899028847
                  </span>
                </div>
                <div className="border p-3 rounded-md rounded-t-none flex flex-col gap-3">
                  {order.products.map((product) => (
                    <div key={product.id} className="flex">
                      <div className="flex-1 flex gap-3">
                        <div className="relative aspect-video size-10">
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            fill
                            sizes="20"
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm">{product.title}</span>
                          <span className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Discount: {product.sku}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-between">
                        <span className="flex items-center h-fit text-sm gap-2">
                          <span className="line-through text-muted-foreground">
                            {formatPrice(product.comparePriceAt!)}
                          </span>
                          <span> {formatPrice(product.price)}</span>{" "}
                          <X className="size-3" />
                          <span>{product.quantity}</span>
                        </span>
                        <span className="text-sm">
                          {formatPrice(product.price * product.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <Badge
                  variant={"secondary"}
                  className="m-2 py-2 px-3 flex items-center gap-1 w-fit"
                >
                  <CiBookmarkCheck className="size-4" />
                  {order.paymentStatus === "complete" ? "paid" : "pending"}
                </Badge>
                <div className="border p-3 rounded-md flex flex-col gap-3">
                  <div className="flex justify-between">
                    <div className="w-1/3">
                      <span>Subtotal</span>
                    </div>
                    <div className="flex-1 justify-between flex">
                      <span>{order.itemCount} items</span>
                      <span>{formatPrice(order.totalPrice / 100)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/3">
                      <span>Discounts</span>
                    </div>
                    <div className="flex-1 justify-between flex">
                      <span className="text-sm">No discounts</span>
                      <span>-{formatPrice(order.shippingPrice)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/3">
                      <span>Shipping</span>
                    </div>
                    <div className="flex-1 justify-between flex">
                      <span className="text-sm">
                        Your order will be delivered in 4-8 business days (Items
                        0.553 kg)
                      </span>
                      <span>{formatPrice(order.shippingPrice)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className=" w-1/3">
                      <span className="font-semibold">Total</span>
                    </div>
                    <div className="flex-1 justify-end flex">
                      {/* <span>{order.itemCount} items</span> */}
                      <span className="font-semibold">
                        {formatPrice(order.totalPrice / 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold">Customer</h2>
                <div className="mb-5">
                  <p>
                    <Link
                      href={""}
                      className="text-sky-600 text-sm font-medium hover:underline"
                    >
                      {order.shippingAddress?.fullName ||
                        order.shippingAddress?.firstName +
                          " " +
                          order.shippingAddress?.lastName}
                    </Link>
                  </p>
                  <p className="text-sm">
                    {/* {selectedCustomer.orders.length
                      ? selectedCustomer.orders.length + " orders"
                      : "No orders"} */}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Contact information</h3>
                  <div
                    className="flex items-center justify-between text-sm mb-3 hover:cursor-pointer"
                    onClick={handleCopyEmail}
                  >
                    <span className="w-[90%] break-all text-sky-600 text-sm font-medium hover:underline">
                      {order.email === "" ? "Email not available" : order.email}
                    </span>
                    <span>
                      <Clipboard className="size-4 " />
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Shipping address</h3>
                  <p className="text-sm">
                    {order.shippingAddress?.fullName ||
                      order.shippingAddress?.firstName +
                        " " +
                        order.shippingAddress?.lastName}
                    <br />
                    {order.shippingAddress?.line1}
                    <br />
                    {order.shippingAddress?.apartment}{" "}
                    {order.shippingAddress?.city +
                      " " +
                      order.shippingAddress?.state +
                      " " +
                      order.shippingAddress?.postal_code}
                    <br />
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:flex gap-5">
            <div className="md:w-2/3">
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Products</h2>
                <div>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="w-full">
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between font-normal"
                      >
                        Browse all products
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[600px] md:w-[450px] lg:w-[550px]">
                      <Command>
                        <div className="p-3 flex items-center justify-between gap-5">
                          <div className="flex-1">
                            <CommandInput placeholder="Search products..." />
                          </div>
                          <Button
                            onClick={() => setOpen(!open)}
                            variant={"outline"}
                            size={"xs"}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup className="flex flex-col gap-3 h-[250px] overflow-y-auto">
                          {products.map((product, i) => (
                            <label key={product.id} htmlFor={`prodId${i}`}>
                              <CommandItem className="cursor-pointer">
                                <div className="w-full flex items-center gap-3">
                                  <Checkbox
                                    id={`prodId${i}`}
                                    checked={selectedProducts.some(
                                      (selectedProduct) =>
                                        selectedProduct.id === product.id
                                    )}
                                    onCheckedChange={() =>
                                      handleCheckboxChange(product.id)
                                    }
                                  />

                                  <div className="relative aspect-video size-10">
                                    <Image
                                      src={
                                        product.images[0]?.url ||
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                                      }
                                      alt={product.title}
                                      fill
                                      sizes="20"
                                      className="object-cover rounded-md"
                                    />
                                  </div>
                                  {product.title}
                                </div>
                              </CommandItem>
                            </label>
                          ))}
                        </CommandGroup>
                        <div className="p-3 flex justify-end border-t-2">
                          <Button
                            size={"sm"}
                            onClick={() => {
                              setOpen(!open);
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {selectedProducts.length > 0 && (
                  <div className="mt-5">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-start">Product</th>
                          <th className="text-start">Quantity</th>
                          <th className="text-start">Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedProducts.map((prod) => (
                          <tr key={prod.id}>
                            <td className="flex p-2 items-center gap-3">
                              <div className="relative aspect-video size-10">
                                <Image
                                  src={
                                    prod.images[0]?.url ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                                  }
                                  alt={prod.title}
                                  fill
                                  sizes="20"
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{prod.title}</span>
                                <span className="text-sm text-muted-foreground">
                                  {prod.sku}
                                </span>
                                <span className="text-xs">
                                  {formatPrice(prod.price)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <Input
                                defaultValue={productQuantities[prod.id] || 1}
                                type="number"
                                min={1}
                                className="w-[100px]"
                                onChange={(e) =>
                                  handleQuantityChange(
                                    prod.id,
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td>
                              <span className="font-normal text-sm">
                                {formatPrice(
                                  (productQuantities[prod.id] || 1) * prod.price
                                )}
                              </span>
                            </td>
                            <td>
                              <Button
                                onClick={() => handleDeleteProduct(prod.id)}
                                variant={"outline"}
                                size={"xs"}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Payment</h2>
                <div className="border rounded-md py-3 px-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Subtotal</span>
                    <span className="text-sm font-normal">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Estimated tax</span>
                    <span className="text-sm font-normal">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-sm font-semibold">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                {selectedProducts.length > 0 && (
                  <div className="mt-5 flex justify-end">
                    <Button disabled={isLoading} size={"sm"} onClick={onSubmit}>
                      {isLoading ? "Creating order" : "Collect payment"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 ">
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3 flex justify-between">
                  Customer
                  {selectedCustomer && (
                    <Button
                      size={"xs"}
                      variant={"ghost"}
                      onClick={() => setSelectedCustomer(undefined)}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </h2>
                {selectedCustomer ? (
                  <div>
                    <div className="mb-5">
                      <p>
                        <Link
                          href={""}
                          className="text-sky-600 text-sm font-medium hover:underline"
                        >
                          {selectedCustomer.name}
                        </Link>
                      </p>
                      <p className="text-sm">
                        {selectedCustomer.orders.length
                          ? selectedCustomer.orders.length + " orders"
                          : "No orders"}
                      </p>
                    </div>
                    <div>
                      {/* <h3 className="font-medium mb-2">
                        Contact information
                      </h3> */}
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold">Contact information</h2>
                        <span>
                          <Dialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size={"xs"}
                                type="button"
                                variant={"ghost"}
                              >
                                <Edit3Icon className="size-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-200 max-w-[900px] w-[90%] p-0 overflow-hidden">
                              <DialogHeader className="px-2">
                                <DialogTitle className="pt-3">
                                  Edit customer
                                </DialogTitle>
                              </DialogHeader>
                              <EditCustomerForm
                                user={selectedCustomer}
                                handleDialogOpen={handleDialogOpen}
                                handleSetSelectedCustomer={setSelectedCustomer}
                              />
                            </DialogContent>
                          </Dialog>
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-between text-sm mb-3 hover:cursor-pointer"
                        onClick={handleCopyEmail}
                      >
                        <span className="w-[90%] break-all text-sky-600 text-sm font-medium hover:underline">
                          {selectedCustomer.email}
                        </span>
                        <span>
                          <Clipboard className="size-4" />
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Shipping address</h3>
                      <p className="text-sm">
                        {selectedCustomer.addresses[0].firstName +
                          " " +
                          selectedCustomer.addresses[0].lastName}
                        <br />
                        {selectedCustomer.addresses[0].line1}
                        <br />
                        {selectedCustomer.addresses[0].apartment}{" "}
                        {selectedCustomer.addresses[0].city +
                          " " +
                          selectedCustomer.addresses[0].state +
                          " " +
                          selectedCustomer.addresses[0].postal_code}
                        <br />
                        {selectedCustomer.addresses[0].country}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <AddCustomerToOrder
                      users={users}
                      open2={open2}
                      setOpen2={setOpen2}
                      setSelectedCustomer={handleSetSelectedCustomer}
                    />
                  </div>
                )}
              </div>
              {/* <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                section 2
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddOrderForm;
