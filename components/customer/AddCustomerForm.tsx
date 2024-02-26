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
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
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
import { signIn } from "next-auth/react";
import { useToast } from "../ui/use-toast";

interface AddCustomerFormProps {
  user: any;
}

const AddCustomerForm = ({ user }: AddCustomerFormProps) => {
  const router = useRouter();
  const [leave, setLeave] = useState(false);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
  const useDynamicForm = () => {
    const form = useForm<z.infer<typeof createCustomerFormSchema>>({
      resolver: zodResolver(createCustomerFormSchema),
      defaultValues: user || {
        firstName: "",
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
      console.log("CUSTOMERFORMVALUES>>>", values);
      setIsLoading(true);

      const finalData = {
        ...values,
        password: "12345678",
      };
      axios
        .post("/api/register", finalData)
        .then((res) => {
          // signIn("credentials", finalData);
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
    const { fields } = useFieldArray({
      control: form.control,
      name: "addresses",
    });
    return { form, fields, onSubmit };
  };
  const { fields, form, onSubmit } = useDynamicForm();

  return (
    <div className="flex flex-col max-w-[950px] gap-3 mx-auto">
      <div className="flex items-center mb-5">
        <Dialog open={leave} onOpenChange={setLeave}>
          <Button
            type="button"
            variant={"ghost"}
            // onClick={handleLeavePage}
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
          {/* {product ? product.title : "Add product"} */}New customer
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <div className=" flex flex-col md:flex-row">
            <div className="w-1/3 mb-2 sm:mb-5">
              <span className="font-semibold text-sm">Customer overview</span>
            </div>
            <div className="flex-1 rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <div className="md:flex justify-between gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
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
                      <FormLabel className="text-left">Phone Number</FormLabel>
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
                              defaultValue={""}
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
                            <FormLabel className="text-left">Phone</FormLabel>
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
          <div className="flex justify-end">
            <Button size={"sm"}>Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCustomerForm;
