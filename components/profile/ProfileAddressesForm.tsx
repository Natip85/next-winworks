"use client";
import * as z from "zod";
import {
  Edit3Icon,
  Loader2Icon,
  MessageSquareWarning,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Addresses } from "@prisma/client";
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

interface ProfileAddressesFormProps {
  user: any;
}
const ProfileAddressesForm = ({ user }: ProfileAddressesFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [openForm, setOpenForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);
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
            setOpenForm(false);
            form.reset();
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
    const { fields } = useFieldArray({
      control: form.control,
      name: "addresses",
    });
    return { form, fields, onSubmit };
  };
  const { form, fields, onSubmit } = useDynamicForm();
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
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-semibold text-2xl">My addresses</h1>
        <Button
          onClick={() => setOpenForm(!openForm)}
          variant={"outline"}
          type="button"
          size={"sm"}
          className="flex text-sm gap-1 rounded-lg border-teal-700 text-teal-700"
        >
          <Plus className="size-4" />
          Add New Address
        </Button>
      </div>

      {user.addresses[0]?.line1 === "" ? (
        <div className="flex items-center justify-center gap-4 mb-6 pt-5 mt-10">
          <span className="bg-gray-100 flex size-20 items-center justify-center rounded-full">
            <div>
              <MessageSquareWarning className="text-teal-700" />
            </div>
          </span>
          <h2 className="text-xl">You haven&apos;t added any addresses yet.</h2>
        </div>
      ) : (
        <>
          {user.addresses.map((address: Addresses, i: number) => (
            <div key={i} className="flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold mb-1 md:mb-3">
                    {address.firstName + " " + address.lastName}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground">
                    {address.line1 +
                      ", " +
                      address.city +
                      " " +
                      address.state +
                      " " +
                      address.postal_code +
                      ", " +
                      address.country}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <Edit3Icon
                    className="hover:cursor-pointer"
                    onClick={() => setOpenEditForm(!openEditForm)}
                  />
                  <Trash2 className="text-red-500 hover:cursor-pointer" />
                </div>
              </div>
              {openEditForm && (
                <>
                  <div className="my-10">
                    <h3 className="font-bold text-xl mt-10 mb-5">Contact</h3>

                    <Form {...form}>
                      <form>
                        <div className="md:flex justify-between gap-2">
                          <div className="flex-1">
                            <FormLabel className="text-left">Email</FormLabel>
                            <Input
                              value={user?.email}
                              disabled
                              className="mt-2"
                            />
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
                        <h3 className="font-bold text-xl mt-10 mb-5">
                          Shipping
                        </h3>

                        <div className="bg-white">
                          <div className="flex-1 bg-white">
                            <div>
                              {fields.map(({ id }, index) => (
                                <div key={id}>
                                  <div className="md:flex justify-between gap-2">
                                    <FormField
                                      control={form.control}
                                      name={`addresses.${index}.firstName`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1 ">
                                          <FormLabel className="text-xs">
                                            First name
                                          </FormLabel>
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
                                          <FormLabel className="text-xs">
                                            Last name
                                          </FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <FormField
                                      control={form.control}
                                      name={`addresses.${index}.line1`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1 ">
                                          <FormLabel className="text-xs">
                                            Address
                                          </FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div>
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

                                  <div>
                                    <FormField
                                      control={form.control}
                                      name={`addresses.${index}.city`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1 ">
                                          <FormLabel className="text-xs">
                                            City
                                          </FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="md:flex justify-between gap-2">
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
                                              const theSelectedCountry =
                                                countries.find(
                                                  (country) =>
                                                    country.name === value
                                                );
                                              if (theSelectedCountry) {
                                                form.setValue(
                                                  `addresses.${index}.countryCode`,
                                                  theSelectedCountry.isoCode
                                                );
                                                setSelectedCountry(
                                                  theSelectedCountry
                                                );
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
                                          <FormLabel className="text-xs">
                                            State
                                          </FormLabel>
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
                                          <FormLabel className="text-xs">
                                            Zip code
                                          </FormLabel>
                                          <FormControl>
                                            <Input {...field} />
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
                        <div className="flex gap-3 my-5">
                          <Button
                            onClick={() => setOpenForm(false)}
                            type="button"
                            variant={"outline"}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            disabled={isLoading}
                            variant={"outline"}
                            className="bg-teal-700 text-white hover:bg-teal-900 hover:text-white"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2Icon /> Processing...
                              </div>
                            ) : (
                              "Save settings"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ProfileAddressesForm;
