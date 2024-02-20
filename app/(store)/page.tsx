import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const imagePaths = [
  "/slide1.jpeg",
  "/slide2.png",
  "/slide3.png",
  "/slide4.png",
  "/slide5.png",
  "/slide6.png",
];

export default function Home() {
  return (
    <div>
      <div className="bg-gray-100">
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[488px_1fr] gap-4">
          <div className="gap-4 mt-6 mb-6 justify-center lg:justify-center items-center lg:items-start w-full flex flex-col px-4 md:px-8">
            <span className="aspect-video block relative overflow-hidden h-[100px] w-auto">
              <Image
                src={"/aura_logo-new-left.png"}
                alt="baby feeding"
                priority
                fill
                sizes="(max-width: 768px) 100vw, 100vw"
                className="transition-[scale,filter] duration-700"
              />
            </span>
            <span className="text-4xl  md:text-5xl  font-bold text-center md:text-left ">
              The First-Ever Parent Assistant
            </span>
            <span className="text-2xl md:text-3xl mb-2 font-normal text-center md:text-left">
              Introducing the next generation of baby monitoring.
            </span>
            <div className="gap-8 justify-start lg:justify-start items-start lg:items-start flex flex-wrap">
              <Link
                href={"/store"}
                className="inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background text-teal-600 hover:text-teal-700 disabled:text-gray-300 max-w-max gap-2"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={"/store"}
                className="inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background text-teal-600 hover:text-teal-700 disabled:text-gray-300 max-w-max gap-2"
              >
                Buy Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="items-center lg:items-center w-full flex flex-col">
            <span className="block relative overflow-hidden h-auto w-auto">
              <Image
                src={"/aura-phone_hero.png"}
                alt="logo"
                width={600}
                height={600}
              />
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 px-8 lg:px-[112px] pt-10 pb-10">
        <p className="text-2xl mx-auto max-w-[350px] text-center font-[400] leading-[2rem] text-gray-700">
          {'"Most innovative designs in health and wellness"'}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-12 gap-y-4">
          <span className="aspect-video block relative overflow-hidden h-auto w-auto">
            <Image src={"/time.png"} alt="logo" width={73} height={41} />
          </span>
          <span className="aspect-video block relative overflow-hidden h-auto w-auto">
            <Image
              src={"/parents.png"}
              alt="logo"
              width={73}
              height={41}
              className="h-[100%]"
            />
          </span>
          <span className="aspect-video block relative overflow-hidden h-auto w-auto">
            <Image
              src={"/babycenter.png"}
              alt="logo"
              width={73}
              height={41}
              className="h-[100%]"
            />
          </span>

          <span className="aspect-video block relative overflow-hidden h-auto w-auto">
            <Image
              src={"/fastcompany.png"}
              alt="logo"
              width={73}
              height={41}
              className="h-[100%]"
            />
          </span>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[488px_1fr] gap-4 mt-10 mb-10 px-4 md:px-8">
        <div className="gap-4 justify-center lg:justify-center w-full flex flex-col">
          <h3 className="text-4xl md:text-4xl mt-2 font-bold text-center md:text-left">
            The Nanobébé Experience
          </h3>
          <p className="text-2xl md:text-2xl font-normal text-center md:text-left ">
            An innovation-forward, thoughtfully designed collection that
            seamlessly integrates into the daily life of modern parents.
          </p>
          <div className="gap-8 justify-center lg:justify-start items-center lg:items-start flex flex-wrap">
            <Link
              href={"/store"}
              className="flex items-center gap-2 text-teal-600"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="gap-4 w-full flex flex-col">
          <span className="aspect-video block relative overflow-hidden h-auto w-auto">
            <Image
              src={"/ultimate_pink.jpg"}
              alt="prod pic"
              width={1200}
              height={800}
            />
          </span>
        </div>
      </div>
      <div className="w-full px-4 lg:px-8 pt-4 pb-4 bg-gray-100">
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white flex justify-between overflow-hidden flex-col rounded-3xl h-full">
            <div className="h-auto w-full lg:h-full">
              <span className="aspect-video block relative overflow-hidden h-auto w-auto">
                <Image
                  src={"/baby_feeding.jpeg"}
                  alt="baby feeding"
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="transition-[scale,filter] duration-700"
                />
              </span>
            </div>
            <div className="flex max-w-[348px] flex-col pt-6 pb-6 pl-6 pr-6">
              <h3 className="text-4xl md:text-4xl font-bold text-center md:text-left">
                Award-Winning Baby Feeding
              </h3>
              <p className="text-2xl md:text-2xl mt-4 font-normal text-center md:text-left">
                Loved by babies from day one. The first bottle designed to
                preserve breast milk nutrients & the most advanced silicone
                bottle on the market.
              </p>
              <div className="gap-8 justify-center lg:justify-center items-center lg:items-center flex flex-wrap">
                <Link
                  href={"/store"}
                  className="inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background text-teal-600 hover:text-teal-700 disabled:text-gray-300 rounded-md mt-4 max-w-max"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-between overflow-hidden flex-col rounded-3xl h-full">
            <div className="h-auto w-full bg-white">
              <span className="aspect-video block relative overflow-hidden h-auto w-auto">
                <Image
                  src={"/sets-coutrney-1.jpg"}
                  alt="baby feeding"
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, 100vw"
                  className="transition-[scale,filter] duration-700"
                />
              </span>
              <div className="flex max-w-[348px] flex-col pt-6 pb-6 pl-6 pr-6">
                <h3 className="text-4xl md:text-4xl font-bold text-center md:text-left">
                  Gift Sets & Baby Registry Must-Haves
                </h3>
                <p className="text-2xl md:text-2xl mt-4 font-normal text-center md:text-left">
                  Curated bundles with everything needed to prepare for a new
                  babys feeding journey. The perfect gifts for new or expecting
                  parents.
                </p>
                <div className="gap-8 justify-center lg:justify-center items-center lg:items-center flex flex-wrap">
                  <Link
                    href={"/store"}
                    className="inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background text-teal-600 hover:text-teal-700 disabled:text-gray-300 rounded-md mt-4 max-w-max"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 gap-6 lg:gap-12 mb-10">
        <div className="gap-4 mt-16 w-full flex flex-col">
          <h2 className="text-4xl md:text-4xl font-bold text-center">
            {"Let's Get Social"}
          </h2>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-3/4"
        >
          <CarouselContent>
            {imagePaths.map((img, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="aspect-square w-full relative overflow-hidden">
                  <Image
                    src={img}
                    alt="baby feeding"
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="transition-[scale,filter] duration-700"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-[50%] left-[70px]">
            <CarouselPrevious />
          </div>
          <div className="absolute top-[50%] right-[70px]">
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
