import Link from "next/link";
import Container from "./Container";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-300 py-12">
      <div className="mx-auto box-border w-full max-w-screen-xl px-4 lg:px-8">
        <div className="mb-12 lg:flex lg:gap-8">
          <div className="mb-12 flex max-w-[330px] flex-col gap-y-8 lg:mb-0">
            <Link href={"/"} className="block w-36">
              <div className="aspect-square overflow-hidden relative w-1/2">
                <Image
                  src={"/logo.svg"}
                  alt="slide images"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="flex items-center justify-between gap-x-6">
              <div className="flex gap-x-6">
                <Link href={"/"}>
                  <FaInstagram className="h-7 w-7" />
                </Link>
                <Link href={"/"}>
                  <FaFacebook className="h-7 w-7" />
                </Link>
                <Link href={"/"}>
                  <FaTiktok className="h-7 w-7" />
                </Link>
                <Link href={"/"}>
                  <FaYoutube className="h-7 w-7" />
                </Link>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400"></div>
            <div className="flex gap-2">
              <Input className="flex h-9 w-full rounded-lg px-3 py-2 border text-base text-gray-900 shadow-xs border-gray-300 placeholder:text-gray-500 placeholder:text-base disabled:text-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed  focus-visible:border-teal-500 focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-2 focus-visible:ring-primary-50 bg-white" />
              <Button
                size={"sm"}
                className="inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background bg-teal-700 text-white hover:bg-teal-800 disabled:bg-gray-200 py-1 px-1.5 text-sm rounded-lg"
              >
                Subscribe
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-8 md:flex-row">
            <div className="flex-1">
              <Link href={"/"}>My account</Link>
              <div className="mt-4 columns-2 md:columns-1">
                <Link
                  href={"/"}
                  className="block max-w-max py-1.5 font-normal text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  Sign up
                </Link>
                <Link
                  href={"/"}
                  className="block max-w-max py-1.5 font-normal text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  Sign up
                </Link>
                <Link
                  href={"/"}
                  className="block max-w-max py-1.5 font-normal text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <Link href={"/"}>My account</Link>
              <div className="mt-4 columns-2 md:columns-1">
                <Link
                  href={"/"}
                  className="block max-w-max py-1.5 font-normal text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <Link href={"/"}>My account</Link>
              <div className="mt-4 columns-2 md:columns-1">
                <Link
                  href={"/"}
                  className="block max-w-max py-1.5 font-normal text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <Link href={"/"}>My account</Link>
              <div className="mt-4 columns-2 md:columns-1">
                <Link
                  href={"/"}
                  className="block max-w-max py-1.5 font-normal text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-gray-400 mt-8"></div>
        <p className="pt-8 text-gray-400">
          &copy; {new Date().getFullYear()} | next-winWorks. All Rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
