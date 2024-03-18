"use client";
import * as z from "zod";
import { Edit3Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerFormSchema } from "@/validations/createCustomer";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface ProfileDetailsFormProps {
  user: any;
}
const ProfileDetailsForm = ({ user }: ProfileDetailsFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [openForm, setOpenForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    return { form, onSubmit };
  };
  const { form, onSubmit } = useDynamicForm();
  return (
    <div>
      <h1 className="font-semibold mb-1 md:mb-5 text-2xl">Account Details</h1>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold mb-1 md:mb-3">
            {user?.firstName + " " + user?.lastName}
          </h3>
          <p className="text-sm font-light text-muted-foreground">
            {user?.email}
          </p>
        </div>
        <div className="hover:cursor-pointer">
          <Edit3Icon onClick={() => setOpenForm(!openForm)} />
        </div>
      </div>

      {openForm && (
        <div>
          <h3 className="font-bold text-xl mt-10">Edit</h3>
          <Form {...form}>
            <form>
              <div className="flex-1 bg-white mb-5">
                <div className="md:flex justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1 ">
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1 ">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-left">
                          Phone Number
                        </FormLabel>
                        <FormControl className="w-full">
                          <PhoneInput {...field} className="h-[30px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-3">
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
      )}
    </div>
  );
};

export default ProfileDetailsForm;
