"use client";
import { Order, Product, User } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  ChevronsUpDown,
  Clipboard,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
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
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import AddCustomerToOrder from "./AddCustomerToOrder";
import Link from "next/link";
import { useToast } from "../ui/use-toast";

interface AddOrderFormProps {
  order: OrderWithUser | null;
  products: Product[];
  users: any;
}
export type OrderWithUser = Order & {
  user: User;
};

const AddOrderForm = ({ order, products, users }: AddOrderFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [leave, setLeave] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedCustomer, setSelectedCustomer] = useState<User>();
  console.log("selectedCustomer>>>", selectedCustomer);

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

  const finalData = {
    products: selectedProducts.map((product) => ({
      ...product,
      quantity: productQuantities[product.id] || 1,
    })),
    fulfillmentStatus: "Unfullfilled",
    paymentStatus: "pending",
    itemCount: selectedProducts.length,
    shippingAddress: {},
    shippingPrice: 0,
    subtotalPrice: total,
    currency: "usd",
    taxPrice: 0,
    totalDiscounts: 0,
    totalPrice: total,
    deliveryStatus: "dispatched",
    paymentIntentId: "123intent",
    email: "",
    userId: "",
  };
  console.log("finalData>>", finalData);
  const onSubmit = () => {};

  const handleSetSelectedCustomer = (val: any) => {
    console.log("RECEIVED VALUE>>", val);
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
  };

  return (
    <div>
      <div className="flex flex-col max-w-[950px] gap-3 mx-auto">
        <div className="flex items-center mb-5">
          <Dialog open={leave} onOpenChange={setLeave}>
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => {}}
              className="hover:bg-gray-200 p-0 px-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <DialogContent className="max-w-[900px] w-[90%]">
              <DialogHeader>
                <DialogTitle className="my-3">
                  Leave page with unsaved changes?
                </DialogTitle>
                <Separator />
                <DialogDescription className="py-5 text-black">
                  Leaving this page will delete all unsaved changes.
                </DialogDescription>
                <Separator />
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    size={"sm"}
                    variant={"outline"}
                    className="h-[35px]"
                    onClick={() => setLeave(!leave)}
                  >
                    Stay
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  size={"sm"}
                  onClick={() => {
                    setLeave(!leave);
                    router.push("/products");
                  }}
                  className="h-[35px]"
                >
                  Leave page
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="font-bold text-2xl ml-2">
            {order ? order.userId : "Create order"}
          </div>
        </div>
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
                  <Button size={"sm"}>Collect payment</Button>
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
                      {selectedCustomer.ordersCount
                        ? selectedCustomer.ordersCount + " orders"
                        : "No orders"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Contact information</h3>
                    <div
                      className="flex items-center justify-between text-sm mb-3 hover:cursor-pointer"
                      onClick={handleCopyEmail}
                    >
                      <span className="w-[90%] break-all text-sky-600 text-sm font-medium hover:underline">
                        {selectedCustomer.email}
                      </span>
                      <span>
                        <Clipboard className="size-4 " />
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Shipping address</h3>
                    <p className="text-sm">
                      {selectedCustomer.addresses[0].fullName}
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
            <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              section 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrderForm;
