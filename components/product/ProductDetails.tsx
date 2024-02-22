"use client";
import { Image as prismaImg, Product, Variant } from "@prisma/client";
import Container from "../Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Separator } from "../ui/separator";
import { cn, formatPrice, truncateText2 } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import SideDrawer from "../SideDrawer";
import { CheckCheckIcon } from "lucide-react";
import { Rating } from "@mui/material";

const imagePaths = [
  "/slide1.jpeg",
  "/slide2.png",
  "/slide3.png",
  "/slide4.png",
  "/slide5.png",
  "/slide6.png",
];
interface Option {
  name: string;
}
export type CartProductType = {
  id: string;
  title: string;
  decription: string;
  images: prismaImg[];
  options: Option[];
  productCategory: string;
  productType: string;
  quantity: number;
  price: number;
  variant?: any;
};

interface ProductDetailsProps {
  product: any;
  variant?: Variant[];
}
const ProductDetails = ({ product, variant }: ProductDetailsProps) => {
  const router = useRouter();
  const { handleAddProductToCart, cartProducts } = useCart();
  const [productImages, setProductImages] = useState(product.images);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    decription: product.description,
    images: [product.images[0]],
    quantity: 1,
    price: product.price,
    title: product.title,
    variant: {},
    options: product.options,
    productCategory: product.productCategory,
    productType: product.productType,
  });
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  // console.log({ product });
  // console.log({ variant });

  useEffect(() => {
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts]);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 99) {
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [cartProduct]);

  const handleSetVariant = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (!variant) return;
      setCartProduct((prev) => {
        return { ...prev, variant: variant[index] };
      });
      setProductImages(variant[index].images);
    },
    [cartProduct]
  );

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [cartProduct]);

  const handleSetBtnIndex = (index: number) => {
    setActiveIndex(index);
  };

  const productRating =
    product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product.reviews.length;

  return (
    <Container>
      <div className="grid grid-cols-4 md:grid-cols-12 xl:max-w-screen-xl gap-4 lg:gap-8">
        <div className="col-span-full lg:col-span-7">
          <div className="relative w-full lg:sticky lg:top-20">
            <div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {productImages.map((img: prismaImg, index: number) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square w-full relative overflow-hidden ">
                        <Image
                          src={img?.url || ""}
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
        </div>
        <div className="col-span-full lg:col-span-5">
          <div className="mb-6 lg:px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {product.title}{" "}
            </h1>
            <p className="text-sm leading-sm md:text-base mt-1 text-gray-600">
              {truncateText2(product.description)}
            </p>
            <div className="my-5 flex items-center gap-3 text-muted-foreground">
              <Rating value={productRating} readOnly /> (
              {product.reviews.length})
            </div>
            <div className="flex flex-col gap-2 mt-4 lg:mt-6">
              <p className="text-4xl font-bold text-black mb-5">
                {formatPrice(product.price)}
              </p>
              {product?.options.length > 0 && (
                <ul className="flex flex-wrap items-center gap-3 my-3">
                  <li>
                    <span className="text-base mb-3 inline-block font-bold">
                      Options
                    </span>
                    <ul className="grid grid-cols-4 justify-items-center gap-x-1 gap-y-4 md:gap-2">
                      {variant?.map((option, index) => (
                        <li key={option.id} className="outline-transparent">
                          <Button
                            disabled={isProductInCart}
                            variant={"link"}
                            className="cursor-pointer flex flex-col h-fit"
                            onClick={() => {
                              handleSetVariant(index);
                            }}
                          >
                            <div
                              className={cn(
                                "rounded-full flex justify-center items-center p-1 mb-2",
                                index === activeIndex
                                  ? "border-[2px] border-black"
                                  : ""
                              )}
                            >
                              <div
                                className="relative rounded-full outline-current bg-500 w-[38px] h-[38px]"
                                style={{ backgroundColor: option.title }}
                              />
                            </div>
                            <p className="text-xs">{option.title}</p>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            </div>
            <div className="flex flex-col justify-between gap-4 mb-14">
              <Separator />
              <div className="flex gap-1 items-center text-base">
                <p className="text-md font-bold mr-7">Quantity:</p>
                <Button
                  disabled={isProductInCart}
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleQtyDecrease}
                >
                  -
                </Button>
                <div className="flex justify-center w-[25px]">
                  {cartProduct.quantity}
                </div>
                <Button
                  disabled={isProductInCart}
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleQtyIncrease}
                >
                  +
                </Button>
              </div>
              <Separator />
              <Button
                disabled={isProductInCart}
                onClick={() => {
                  handleAddProductToCart(cartProduct);
                  setOpen(!open);
                  setIsProductInCart(!isProductInCart);
                }}
                variant={isProductInCart ? "outline" : "default"}
              >
                {isProductInCart ? (
                  <div className="flex items-center gap-3">
                    <CheckCheckIcon /> <span>Added to cart</span>
                  </div>
                ) : (
                  "Add to cart"
                )}
              </Button>
              <SideDrawer open={open} setOpen={setOpen} variant={variant} />
            </div>
          </div>
          <div>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-4">Description</AccordionTrigger>
                <AccordionContent className="py-3 px-8">
                  <Separator className="mb-3" />
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="p-4">Reviews</AccordionTrigger>
                <AccordionContent className="py-3 px-8">
                  <Separator className="mb-3" />
                  reviews go here
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="my-16 flex flex-col items-center">
        <h2 className="text-4xl mb-8 text-center font-bold">
          Frequently bought together
        </h2>
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
  );
};

export default ProductDetails;
