"use client";
import { createCustomerFormSchema } from "@/validations/createCustomer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Country, ICountry, IState, State } from "country-state-city";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import { PhoneInput } from "../ui/phone-input";
interface AddAddressFormProps {
  user: any;
  handleOpen: () => void;
}
const AddAddressForm = ({ user, handleOpen }: AddAddressFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);

  const useDynamicForm = () => {
    const form = useForm<z.infer<typeof createCustomerFormSchema>>({
      resolver: zodResolver(createCustomerFormSchema),
      defaultValues: {
        firstName: user.firstName,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
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
            userId: user.id,
          },
        ],
      },
    });

    function onSubmit(values: z.infer<typeof createCustomerFormSchema>) {
      if (!values.addresses) return;
      values.addresses = [...user.addresses, values.addresses[0]];
      if (user) {
        axios
          .patch(`/api/register/${user.id}`, values)
          .then(() => {
            toast({
              variant: "success",
              description: "Your account details have been updated",
            });
            setIsLoading(false);
            form.reset();
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

  return (
    <div>
      {fields.map((item, index) => (
        <div key={item.id} className="mb-10">
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
                      <FormLabel className="text-left">Phone Number</FormLabel>
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
                      <FormLabel className="text-xs">Country/region</FormLabel>
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
                            <SelectItem key={country.name} value={country.name}>
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
                            <SelectItem key={state.isoCode} value={state.name}>
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
                  onClick={() => handleOpen()}
                  variant={"outline"}
                  className="text-teal-700 border-teal-700"
                >
                  Cancel
                </Button>
                <Button
                  // onClick={() => toggleEditForm(index)}
                  className="bg-teal-700 text-white hover:bg-teal-900 hover:text-white"
                >
                  Update address
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ))}
    </div>
  );
};

export default AddAddressForm;
