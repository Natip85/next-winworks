"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Clipboard,
  Edit3Icon,
  Loader2Icon,
  Pencil,
  PencilLine,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerFormSchema } from "@/validations/createCustomer";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Country, ICountry, IState, State } from "country-state-city";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { AiOutlineShopping } from "react-icons/ai";
import EditCustomerForm from "./EditCustomerForm";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import moment from "moment";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";

interface AddCustomerFormProps {
  user: any;
}

const AddCustomerForm = ({ user }: AddCustomerFormProps) => {
  const router = useRouter();
  const [leave, setLeave] = useState(false);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();

  const useDynamicForm = () => {
    const form = useForm<z.infer<typeof createCustomerFormSchema>>({
      resolver: zodResolver(createCustomerFormSchema),
      defaultValues: user || {
        firstName: "",
        name: "",
        lastName: "",
        email: "",
        phone: "",
        addresses: [
          {
            line1: "",
            line2: "",
            city: "",
            country: "",
            countryCode: "",
            apartment: "",
            postal_code: "",
            state: "",
            firstName: "",
            lastName: "",
            fullName: "",
            phone: "",
            street: "",
            userId: "",
          },
        ],
      },
    });

    function onSubmit(values: z.infer<typeof createCustomerFormSchema>) {
      setIsLoading(true);

      if (user) {
        // UPDATE
        const finalData = {
          ...values,
        };
        axios
          .patch(`/api/register/${user.id}`, finalData)
          .then((res) => {
            toast({
              variant: "success",
              description: "Customer updated",
            });

            setIsLoading(false);
            router.push(`/customers/${res.data.id}`);
            router.refresh();
          })
          .catch((err) => {
            console.log(err);
            toast({
              variant: "destructive",
              description: "Something went wrong",
            });
            setIsLoading(false);
          });
      } else {
        // CREATE
        const finalData = {
          ...values,
          password: "12345678",
        };
        axios
          .post("/api/register", finalData)
          .then((res) => {
            toast({
              variant: "success",
              description: "Registered succesfully",
            });
            router.push(`/customers/${res.data.id}`);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Oops!something went wrong",
            });
          })
          .finally(() => setIsLoading(false));
      }
    }
    const { fields } = useFieldArray({
      control: form.control,
      name: "addresses",
    });
    return { form, fields, onSubmit };
  };

  const { fields, form, onSubmit } = useDynamicForm();
  useEffect(() => {
    if (selectedCountry) {
      const statesForCountry = State.getStatesOfCountry(
        selectedCountry.isoCode
      );
      setAvailableStates(statesForCountry);
    } else {
      setAvailableStates([]);
    }
  }, [selectedCountry]);
  const handleLeavePage = () => {
    if (pathname === "/customers/new") {
      if (Object.keys(form.formState.touchedFields).length > 0) {
        setLeave(!leave);
      } else {
        router.push("/customers");
      }
    } else {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        setLeave(!leave);
      } else {
        router.push("/customers");
      }
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email.toString());
    toast({
      variant: "success",
      description: "Copied to clipboard",
    });
  };

  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const calculateTotalOrderPrice = (user: any) => {
    let totalPrice = 0;

    user.orders?.forEach((order: any) => {
      totalPrice += order.totalPrice;
    });
    const formattedTotalPriceSum = totalPrice / 100;
    return formatPrice(formattedTotalPriceSum);
  };
  return (
    <div className="flex flex-col max-w-[950px] gap-3 mx-auto">
      <div className="flex flex-col mb-5">
        <div className="flex items-center">
          <Dialog open={leave} onOpenChange={setLeave}>
            <Button
              type="button"
              variant={"ghost"}
              onClick={handleLeavePage}
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
                    router.push("/customers");
                  }}
                  className="h-[35px]"
                >
                  Leave page
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="font-bold text-2xl ml-2">
            {user ? user.firstName : "New customer"}
          </div>
        </div>
        {user && (
          <div className="pl-10 text-sm text-muted-foreground">
            {user.addresses[0]?.city}, {user.addresses[0]?.state},{" "}
            {user.addresses[0]?.country}
          </div>
        )}
      </div>
      {!user ? (
        <>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
              <div className=" flex flex-col md:flex-row">
                <div className="w-1/3 mb-2 sm:mb-5">
                  <span className="font-semibold text-sm">
                    Customer overview
                  </span>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                  <div className="md:flex justify-between gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-[35px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-[35px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-[35px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-left">
                            Phone Number
                          </FormLabel>
                          <FormControl className="w-full">
                            <PhoneInput className="h-[35px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Separator className="mb-5" />
              <div className="md:flex">
                <div className="w-1/3 mb-2 sm:mb-5">
                  <span className="font-semibold text-sm">Address</span>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                  <div>
                    {fields.map(({ id }, index) => (
                      <div key={id}>
                        <div>
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.countryCode`}
                            render={({ field }) => (
                              <FormItem>
                                <Input type="hidden" {...field} />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.country`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country/region</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    // Get the country code based on the selected country name
                                    const selectedCountry = countries.find(
                                      (country) => country.name === value
                                    );
                                    if (selectedCountry) {
                                      form.setValue(
                                        `addresses.${index}.countryCode`,
                                        selectedCountry.isoCode
                                      );
                                      setSelectedCountry(selectedCountry);
                                    }
                                    field.onChange(value);
                                  }}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="bg-background h-[35px]">
                                    <SelectValue
                                      defaultValue={field.value}
                                      placeholder="Select a country"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countries.map((country) => (
                                      <SelectItem
                                        key={country.name}
                                        value={country.name}
                                      >
                                        {country.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:flex justify-between gap-2 mt-3">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem className="flex-1 ">
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-[35px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-[35px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="mt-3">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.line1`}
                            render={({ field }) => (
                              <FormItem className="flex-1 ">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-[35px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="mt-3">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.apartment`}
                            render={({ field }) => (
                              <FormItem className="flex-1 ">
                                <FormLabel>Apartment, suite, etc.</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-[35px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:flex justify-between gap-2">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.city`}
                            render={({ field }) => (
                              <FormItem className="flex-1 ">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-[35px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.state`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>State</FormLabel>
                                <Select
                                  value={field.value}
                                  defaultValue={
                                    user
                                      ? user.addresses[0]?.state
                                      : field.value
                                  }
                                  onValueChange={(selectedState) => {
                                    field.onChange(selectedState);
                                  }}
                                >
                                  <SelectTrigger className="bg-background h-[35px]">
                                    <SelectValue
                                      defaultValue={field.value}
                                      placeholder="Select a state"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableStates.map((state) => (
                                      <SelectItem
                                        key={state.isoCode}
                                        value={state.name}
                                      >
                                        {state.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="mt-3">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.postal_code`}
                            render={({ field }) => (
                              <FormItem className="flex-1 ">
                                <FormLabel>Zip code</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-[35px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="mt-3">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.phone`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel className="text-left">
                                  Phone
                                </FormLabel>
                                <FormControl className="w-full">
                                  <PhoneInput className="h-[35px]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {user ? (
                <div className="flex items-center justify-end gap-3">
                  <Button
                    disabled={isLoading}
                    className="max-w-[150px] h-[30px]"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Loader2Icon className="mr-2 h-4 w-4" /> Updating
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <PencilLine className="mr-2 h-4 w-4" /> Update customer
                      </span>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <Button
                    disabled={isLoading}
                    className="max-w-[150px] h-[30px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4" /> Creating
                        customer...
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-4 w-4" /> Save
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </>
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:mr-5">
            <div className="flex gap-3 rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <div className="border-r-2 w-fit flex">
                <span className="flex items-center gap-2 text-sm mr-5 text-muted-foreground">
                  <AiOutlineShopping className="size-4 " />
                  All time
                </span>
              </div>
              <div className="w-1/3 flex flex-col justify-center items-center border-r-2">
                <span className="font-normal text-xs">Amount spent</span>
                <span className="font-semibold text-sm">
                  {calculateTotalOrderPrice(user)}
                </span>
              </div>
              <div className="w-1/3 flex flex-col justify-center items-center">
                <span className="font-normal text-xs">
                  {user.orders.length > 0 ? "orders" : "order"}
                </span>
                <span className="font-semibold text-sm">
                  {user.orders.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <h2 className="font-semibold mb-3">Last order placed</h2>
              {user.orders.length > 0 ? (
                <div>
                  <div className="p-3 border border-b-0">
                    <div className="flex justify-between items-center">
                      <div className="w-3/4 flex gap-3 items-center">
                        <span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={""}>
                                  <span className="text-sm font-semibold hover:cursor-pointer hover:underline">
                                    {user.orders[0]?.id.substring(0, 6)}
                                    ...
                                  </span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.orders[user.orders.length - 1]?.id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                        <span>
                          <Badge
                            variant={
                              user.orders[user.orders.length - 1]
                                ?.paymentStatus === "complete"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {user.orders[user.orders.length - 1]
                              ?.paymentStatus === "complete"
                              ? "paid"
                              : "pending"}
                          </Badge>
                        </span>
                        <span>
                          <Badge>
                            {
                              user.orders[user.orders.length - 1]
                                ?.fulfillmentStatus
                            }
                          </Badge>
                        </span>
                      </div>
                      <div>
                        {formatPrice(
                          user.orders[user.orders.length - 1]?.totalPrice / 100
                        )}
                      </div>
                    </div>
                    <div>
                      {moment(
                        user.orders[user.orders.length - 1]?.createdAt
                      ).format("MMMM Do YYYY, h:mm:ss a")}
                    </div>
                  </div>
                  {user.orders[0]?.products.map((product: any) => (
                    <div
                      key={product.id}
                      className="border flex justify-between p-3"
                    >
                      <div className="w-3/4 flex gap-3">
                        <span className="relative aspect-video size-14">
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            fill
                            sizes="30"
                            className="object-cover rounded-md"
                          />
                        </span>
                        <span>{product.title}</span>
                      </div>
                      <div className="flex-1 flex justify-between">
                        <span>X{product.quantity}</span>
                        <span>{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-end mt-5">
                    <Button
                      onClick={() => router.push("/orders/new")}
                      size={"sm"}
                    >
                      Create order
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-muted-foreground mb-3">
                    This customer hasn’t placed any orders yet
                  </div>
                  <Button
                    onClick={() => router.push("/orders/new")}
                    size={"sm"}
                  >
                    Create order
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="flex flex-col gap-3 rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Customer</h2>
                <span>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size={"xs"} type="button" variant={"ghost"}>
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
                        user={user}
                        handleDialogOpen={handleDialogOpen}
                      />
                    </DialogContent>
                  </Dialog>
                </span>
              </div>

              <h4 className="font-semibold text-sm">Contact information</h4>
              <div className="flex   items-center justify-between text-sm mb-3">
                <span className="w-[90%] break-all">{user.email}</span>
                <span>
                  <Clipboard
                    className="size-4 hover:cursor-pointer"
                    onClick={handleCopyEmail}
                  />
                </span>
              </div>
              <h4 className="font-semibold text-sm">Address</h4>
              <div className="flex flex-col">
                <span className="font-normal text-sm">
                  {user.addresses[0]?.firstName +
                    " " +
                    user.addresses[0]?.lastName}
                </span>
                <span className="font-normal text-sm">
                  {user.addresses[0]?.line1}
                </span>
                <span className="font-normal text-sm">
                  {user.addresses[0]?.city}, {user.addresses[0]?.state},{" "}
                  {user.addresses[0]?.postal_code}
                </span>
                <span className="font-normal text-sm">
                  {user.addresses[0]?.country}
                </span>
                <span className="font-normal text-sm">
                  {user.addresses[0]?.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomerForm;
