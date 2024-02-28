"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { PasswordInput } from "../ui/password-input";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { registerFormSchema } from "@/validations/register";

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      lastName: "",
      firstName: "",
    },
  });

  // useEffect(() => {
  //   const isFormValid = form.formState.isValid;
  //   setIsLoading(!isFormValid);
  // }, [form.formState.isValid]);

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsLoading(true);
    axios
      .post("/api/register", values)
      .then(() => {
        signIn("credentials", values);
        toast({
          variant: "success",
          description: "Registered succesfully",
        });
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

  return (
    <div className="w-fit m-2">
      <div className="bg-white p-10 shadow rounded-lg w-fit">
        <div
          className="flex items-center gap-1 cursor-pointer mb-8"
          onClick={() => router.push("/")}
        >
          <Image
            src={"/logo.svg"}
            alt="logo"
            width="30"
            height="30"
            className="aspect-square"
          />
          <div className={"font-bold text-xl"}>Next-WinWorks</div>
        </div>
        <h2 className="mb-1 text-2xl font-semibold tracking-tight">
          Create a next-winworks account
        </h2>
        <span className="text-sm text-black">
          One last step before you get started
        </span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm w-full hover:cursor-pointer">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm w-full hover:cursor-pointer ">
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm w-full hover:cursor-pointer ">
                      Last name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full " />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="mt-3 text-muted-foreground">
              Enter your first and last name as they appear on your
              government-issued ID.
            </p>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm  w-full hover:cursor-pointer ">
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="w-full " />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button className="w-full mt-5 " disabled={isLoading}>
                {isLoading
                  ? "Create next-winworks account"
                  : "Create next-winworks account"}
              </Button>
            </div>
            <div className="flex justify-center items-center mt-5">
              <span className="text-xs mr-2 ">
                Already have a next-winworks account?
              </span>

              <span
                className="flex items-center text-blue-600 hover:cursor-pointer"
                onClick={() => router.push("/auth")}
              >
                Log in
                <ArrowRight
                  size={16}
                  className="ml-2 hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
