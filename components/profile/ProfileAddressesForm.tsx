"use client";
import * as z from "zod";
import { Edit3Icon, Plus, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { createCustomerFormSchema } from "@/validations/createCustomer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Country, ICountry, IState, State } from "country-state-city";
import AddAddressForm from "./AddAddressForm";

interface ProfileAddressesFormProps {
  user: any;
}
const ProfileAddressesForm = ({ user }: ProfileAddressesFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);
  const [editFormIndex, setEditFormIndex] = useState<number | null>(null);

  const useDynamicForm = () => {
    const form = useForm<z.infer<typeof createCustomerFormSchema>>({
      resolver: zodResolver(createCustomerFormSchema),
      defaultValues: user || {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        addresses: [],
      },
    });

    function onSubmit(values: z.infer<typeof createCustomerFormSchema>) {
      console.log("VALUES>>>", values);
      setIsLoading(true);

      if (user) {
        axios
          .patch(`/api/register/${user.id}`, values)
          .then(() => {
            toast({
              variant: "success",
              description: "Your account details have been updated",
            });
            setIsLoading(false);
            router.push("/dashboard");
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
      }
    }
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "addresses",
    });
    const handleRemove = (index: number) => {
      remove(index);
    };
    const handleAppend = () => {
      append({
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
        userId: user.id,
      });
    };
    return { form, fields, onSubmit, handleAppend, handleRemove };
  };
  const { form, fields, onSubmit, handleRemove, handleAppend } =
    useDynamicForm();
  useEffect(() => {
    const usersCountry = countries.find(
      (country) => country.name === user.addresses[0].country
    );
    setSelectedCountry(usersCountry);
  }, []);

  useEffect(() => {
    const statesForCountry = State.getStatesOfCountry(selectedCountry?.isoCode);
    setAvailableStates(statesForCountry);
  }, [selectedCountry]);
  const toggleEditForm = (index: number) => {
    setEditFormIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-semibold text-2xl">My addresses</h1>
        <Button
          onClick={() => setOpenAddForm(!openAddForm)}
          variant={"outline"}
          type="button"
          size={"sm"}
          className="flex text-sm gap-1 rounded-lg border-teal-700 text-teal-700"
        >
          <Plus className="size-4" />
          Add New Address
        </Button>
      </div>
      {openAddForm && (
        <AddAddressForm
          user={user}
          handleOpen={() => setOpenAddForm(!openAddForm)}
        />
      )}

      {/* {user.addresses[0]?.line1 === "" ? (
        <div className="flex items-center justify-center gap-4 mb-6 pt-5 mt-10">
          <span className="bg-gray-100 flex size-20 items-center justify-center rounded-full">
            <div>
              <MessageSquareWarning className="text-teal-700" />
            </div>
          </span>
          <h2 className="text-xl">You haven&apos;t added any addresses yet.</h2>
        </div>
      ) : ( */}

      <div>
        {fields.map((item, index) => (
          <div key={item.id} className="mb-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex-1">
                <p className="font-semibold mb-2">
                  {item?.firstName + " " + item?.lastName}
                </p>
                <p className="font-thin text-sm">
                  {item.line1 +
                    ", " +
                    item.city +
                    " " +
                    item.state +
                    " " +
                    item.postal_code +
                    ", " +
                    item.country}
                </p>
              </div>

              <div>
                <Button
                  variant={"outline"}
                  size={"xs"}
                  type="button"
                  onClick={() => toggleEditForm(index)}
                  className="ml-5 h-[30px]"
                >
                  <Edit3Icon className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant={"outline"}
                  size={"xs"}
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="ml-5 h-[30px]"
                >
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            {editFormIndex === index && (
              <Form key={item.id} {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <h3 className="font-bold text-xl mt-10 mb-5">Contact</h3>

                  <div className="md:flex justify-between gap-2 mb-5">
                    <div className="flex-1">
                      <FormLabel className="text-left">Email</FormLabel>
                      <Input value={user?.email} disabled className="mt-2" />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-left">
                            Phone Number
                          </FormLabel>
                          <FormControl className="w-full">
                            <PhoneInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Shipping</h3>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel className="text-xs">First name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel className="text-xs">Last name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.line1`}
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel className="text-xs">Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`addresses.${index}.apartment`}
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel className="text-xs">
                            Apartment, suite, etc.
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.city`}
                    render={({ field }) => (
                      <FormItem className="flex-1 ">
                        <FormLabel className="text-xs">City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.countryCode`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <Input type="hidden" {...field} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.country`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs">
                            Country/region
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              // Get the country code based on the selected country name
                              const theSelectedCountry = countries.find(
                                (country) => country.name === value
                              );
                              if (theSelectedCountry) {
                                form.setValue(
                                  `addresses.${index}.countryCode`,
                                  theSelectedCountry.isoCode
                                );
                                setSelectedCountry(theSelectedCountry);
                                setAvailableStates([]);
                              }

                              field.onChange(value);
                            }}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-background">
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
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.state`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs">State</FormLabel>
                          <Select
                            value={field.value}
                            defaultValue={field.value}
                            onValueChange={(selectedState) => {
                              field.onChange(selectedState);
                            }}
                          >
                            <SelectTrigger className="bg-background">
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
                    <FormField
                      control={form.control}
                      name={`addresses.${index}.postal_code`}
                      render={({ field }) => (
                        <FormItem className="flex-1 ">
                          <FormLabel className="text-xs">Zip code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 my-5">
                    <Button
                      type="button"
                      onClick={() => toggleEditForm(index)}
                      variant={"outline"}
                      className="text-teal-700 border-teal-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      // onClick={() => toggleEditForm(index)}
                      className="bg-teal-700 text-white hover:bg-teal-900 hover:text-white"
                    >
                      Update address
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
};

export default ProfileAddressesForm;
