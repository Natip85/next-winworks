import getProducts from "@/actions/getProducts";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from "next/image";

const imagePaths = [
  "/slide1.jpeg",
  "/slide2.png",
  "/slide3.png",
  "/slide4.png",
  "/slide5.png",
  "/slide6.png",
];

const page = async () => {
  const products = await getProducts();
  if (products.length === 0) {
    return <NullData title="Oops! No products found" />;
  }
  return (
    <main className="p-8">
      <Container>
        <div className="mt-10 mb-20 mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 md:grid-cols-[280px_1fr] md:flex-row md:px-8">
          <div className="top-5 mx-auto md:sticky md:top-[135px] md:pt-7">
            <p className="text-2xl hidden font-bold text-gray-900 md:flex">
              Filters
            </p>
            <div className="hidden pr-5 md:block">
              <p className="text-lg my-4 font-bold text-gray-900">Color</p>
              <ul className="grid grid-cols-4 justify-items-center gap-x-1 gap-y-4 md:gap-2">
                {/* {products.map((option, index) =>
                  option.variants.map((variant) => {
                    return (
                      <div>
                        <li className="outline-transparent">
                          <Button
                            variant={"ghost"}
                            className="cursor-pointer flex flex-col h-fit p-0"
                          >
                            <div
                              className="relative rounded-full outline-current  w-[38px] h-[38px] mb-2"
                              style={{
                                backgroundColor: variant.title.toLowerCase(),
                              }}
                            />
                            <p className="text-xs">{variant.title}</p>
                          </Button>
                        </li>
                      </div>
                    );
                  })
                )} */}
              </ul>
              <p className="text-lg my-4 font-bold text-gray-900">Category</p>
              <ul className="flex flex-col">
                <li className="flex gap-2 items-center mb-5">
                  <Checkbox id="cat" />
                  <label
                    htmlFor="cat"
                    className="text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-normal"
                  >
                    category name
                  </label>
                </li>
                <li className="flex gap-2 items-center mb-5">
                  <Checkbox id="cat" />
                  <label
                    htmlFor="cat"
                    className="text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-normal"
                  >
                    category name
                  </label>
                </li>
                <li className="flex gap-2 items-center mb-5">
                  <Checkbox id="cat" />
                  <label
                    htmlFor="cat"
                    className="text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-normal"
                  >
                    category name
                  </label>
                </li>
                <li className="flex gap-2 items-center mb-5">
                  <Checkbox id="cat" />
                  <label
                    htmlFor="cat"
                    className="text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-normal"
                  >
                    category name
                  </label>
                </li>
                <li className="flex gap-2 items-center">
                  <Checkbox id="cat" />
                  <label
                    htmlFor="cat"
                    className="text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-normal"
                  >
                    category name
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <div className="text-center md:text-left">
              <p className="text-4xl mb-1 font-bold text-gray-900">Aura</p>
              <p className="text-lg mb-8 font-normal text-gray-600">
                Introducing the first-ever parent assistant.
              </p>
            </div>
            <div className="grid gap-4 md:gap-8 grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
              {products.map((product) => {
                console.log("THIS>>", product);

                return <ProductCard key={product.id} products={product} />;
              })}
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
      </Container>
    </main>
  );
};

export default page;
