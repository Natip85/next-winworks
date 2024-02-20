"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthSocialButton from "../AuthSocialButton";
import { BsGithub, BsEnvelope } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { PasswordInput } from "../ui/password-input";
import { loginFormSchema } from "@/validations/login";

type UserVariant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<UserVariant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);

    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((callback) => {
        if (!callback?.ok) {
          toast({
            variant: "destructive",
            description: "Invalid credentials",
          });
        }

        if (callback?.ok && !callback?.error) {
          toast({
            variant: "success",
            description: "Logged in!",
          });
          router.push("/");
        }
      })
      .finally(() => setIsLoading(false));
  }
  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast({
            variant: "destructive",
            description: "Invalid credentials",
          });
        }
        if (callback?.ok && !callback?.error) {
          toast({
            variant: "success",
            description: "Logged in!",
          });
        }
      })
      .finally(() => setIsLoading(false));
  };
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
          {variant === "REGISTER" ? "Create a next-winworks account" : "Log in"}
        </h2>
        <span className="text-sm text-black">
          {variant === "REGISTER"
            ? "One last step before you get started"
            : "Continue to next-winworks"}
        </span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            {variant === "REGISTER" && (
              <div className="flex items-center flex-col gap-3">
                <AuthSocialButton
                  icon={BsEnvelope}
                  onClick={() => router.push("/auth/register")}
                  title=" Sign up with email"
                />

                <AuthSocialButton
                  icon={BsGithub}
                  onClick={() => socialAction("github")}
                  title="Sign up with GitHub"
                />

                <AuthSocialButton
                  icon={FcGoogle}
                  onClick={() => socialAction("google")}
                  title="Sign up with Google"
                />
              </div>
            )}

            {variant === "LOGIN" && (
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-muted-foreground w-full hover:cursor-pointer">
                        Email
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
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-muted-foreground w-full hover:cursor-pointer">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} className="w-full" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full mt-3"
                  >
                    Continue with email
                    <ArrowRight
                      size={16}
                      className="ml-2 hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
        </div>
        {variant === "LOGIN" && (
          <div className="flex flex-col gap-3 justify-center">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={FcGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm mt-6">
          <span className="text-xs">
            {variant === "LOGIN"
              ? "New to Next-Winworks?"
              : "Already have a next-winworks account?"}
          </span>
          <span onClick={toggleVariant} className="cursor-pointer">
            {variant === "LOGIN" ? (
              <span className="flex items-center text-blue-600">
                Create an acount
                <ArrowRight
                  size={16}
                  className="ml-2 hover:translate-x-1 transition-transform"
                />
              </span>
            ) : (
              <span className="flex items-center text-blue-600">
                Log in
                <ArrowRight
                  size={16}
                  className="ml-2 hover:translate-x-1 transition-transform"
                />
              </span>
            )}
          </span>
        </div>
        {variant === "REGISTER" && (
          <div className="text-xs text-muted-foreground mt-9">
            By proceeding, you agree to the Terms and Conditions and <br />
            Privacy Policy
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <Link href={""} className="text-xs text-muted-foreground">
            Help
          </Link>
          <Link href={""} className="text-xs text-muted-foreground">
            Privacy
          </Link>
          <Link href={""} className="text-xs text-muted-foreground">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
