import { Loader2Icon, Pencil, PencilLine } from "lucide-react";
import { Button } from "../ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerFormSchema } from "@/validations/createCustomer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Country, ICountry, IState, State } from "country-state-city";

interface EditCustomerFormProps {
  user: any;
  handleDialogOpen: () => void;
}
const EditCustomerForm = ({ user }: EditCustomerFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);
  console.log("USER>>", user);

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
      console.log("EDITFORMVALS>>>", values);

      setIsLoading(true);

      if (user) {
        axios
          .patch(`/api/register/${user.id}`, values)
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
    <div className="max-h-[55vh] overflow-y-auto">
      <Form {...form}>
        <form>
          <div className="bg-white">
            <div className="flex-1  bg-white p-2 mb-3">
              <div className="md:flex justify-between gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel className="text-xs">First name</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-[30px]" />
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
                      <FormLabel className="text-xs">Last name</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-[30px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormLabel className="text-xs">Email</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-[30px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="my-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-left text-xs">
                        Phone Number
                      </FormLabel>
                      <FormControl className="w-full">
                        <PhoneInput className="h-[30px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex-1  bg-white p-2">
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
                              <SelectTrigger className="bg-background h-[30px]">
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
                              <Input {...field} className="h-[30px]" />
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
                              <Input {...field} className="h-[30px]" />
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
                            <FormLabel className="text-xs">Address</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-[30px]" />
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
                              <Input {...field} className="h-[30px]" />
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
                            <FormLabel className="text-xs">City</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-[30px]" />
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
                            <FormLabel className="text-xs">State</FormLabel>
                            <Select
                              value={field.value}
                              defaultValue={field.value}
                              onValueChange={(selectedState) => {
                                field.onChange(selectedState);
                              }}
                            >
                              <SelectTrigger className="bg-background h-[30px]">
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
                    <div>
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.postal_code`}
                        render={({ field }) => (
                          <FormItem className="flex-1 ">
                            <FormLabel className="text-xs">Zip code</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-[30px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.phone`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-left text-xs">
                              Phone
                            </FormLabel>
                            <FormControl className="w-full">
                              <PhoneInput className="h-[30px]" {...field} />
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

            <div className="sticky bottom-0 bg-white flex flex-col justify-end">
              <Separator className="mb-3 h-[2px]" />
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="w-fit self-end my-1 mx-3"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCustomerForm;
