"use client";
import * as z from "zod";
import { Product, Variant } from "@prisma/client";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ArrowLeft, Loader2, Loader2Icon, Pencil, XCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { editVariantSchema } from "@/validations/editVariant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Image as prisImg } from "@prisma/client";
import { UploadButton } from "../uploadthing";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { weightUnitsArray } from "@/lib/utils";

interface EditVariantFormProps {
  variant: Variant | null;
  product: ProductWithVariants | null;
}
export type ProductWithVariants = Product & {
  variants: Variant[];
};
const EditVariantForm = ({ variant, product }: EditVariantFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [valuesData, setValuesData] = useState(variant?.title || "");
  const [images, setImages] = useState<prisImg[] | undefined>(variant?.images);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [shipping, setShipping] = useState(variant?.requiresShipping);

  const form = useForm<z.infer<typeof editVariantSchema>>({
    resolver: zodResolver(editVariantSchema),
    defaultValues: {
      title: valuesData,
      images: images,
      price: variant?.price,
      comparePriceAt: variant?.comparePriceAt,
      inventoryQuantity: variant?.inventoryQuantity,
      sku: variant?.sku,
      weight: variant?.weight,
      weightUnit: variant?.weightUnit,
    },
  });

  useEffect(() => {
    if (images && images.length > 0) {
      form.setValue("images", images, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [form, images]);

  function onSubmit(values: z.infer<typeof editVariantSchema>) {
    axios
      .patch(`/api/variant/${variant?.id}`, values)
      .then((res) => {
        toast({
          variant: "success",
          description: "Variant updated",
        });
        setIsLoading(false);
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
  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);

    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKeys: [imageKey] })
      .then((res) => {
        if (res.data.success) {
          const updatedImages = images?.filter((img) => img.key !== imageKey);
          setImages(updatedImages);

          form.setValue("images", updatedImages, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          toast({
            variant: "success",
            description: "Image removed",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong with delete",
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  return (
    <div>
      <div className="flex items-center mb-5">
        <Dialog>
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => router.push(`/products/${variant?.parentId}`)}
            className="hover:bg-gray-200 p-0 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <DialogContent className="max-w-[900px] w-[90%]">
            <DialogHeader>
              <DialogTitle className="my-3">
                Leave page with unsaved changes?
              </DialogTitle>
              <Separator />
              <DialogDescription className="py-5 text-black">
                Leaving this page will delete all unsaved changes.
              </DialogDescription>
              <Separator />
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  size={"sm"}
                  variant={"outline"}
                  className="h-[35px]"
                  // onClick={() => setLeave(!leave)}
                >
                  Stay
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                size={"sm"}
                onClick={() => {
                  // setLeave(!leave);
                  router.push(`/products/${variant?.parentId}`);
                }}
                className="h-[35px]"
              >
                Leave page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="font-bold text-2xl ml-2">{variant?.title}</div>
      </div>
      <div className="lg:flex w-full">
        <div className="mr-5 w-full lg:w-[35%]">
          <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
            <div className="flex justify-between items-center">
              <div className="w-[90px] h-[90px] overflow-hidden relative aspect-video">
                <Image
                  src={
                    product?.images[0]?.url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                  }
                  alt="prod img"
                  fill
                  sizes="20"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 ml-5 gap-2 flex flex-col">
                <p>{product?.title}</p>
                <div>
                  <Badge variant={"success"}>{product?.status}</Badge>
                </div>
                <div className="text-muted-foreground text-sm">
                  {product?.variants.length} variants
                </div>
              </div>
            </div>
          </div>
          <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
            <h2 className="font-semibold">Variants</h2>

            {product?.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center gap-5 hover:bg-gray-200 hover:cursor-pointer p-1"
                onClick={() => {
                  router.push(
                    `/products/${variant?.parentId}/variants/${variant?.id}`
                  );
                }}
              >
                <div className="aspect-square overflow-hidden relative h-[55px] rounded-lg">
                  <Image
                    fill
                    sizes="30"
                    src={
                      variant.images[0]?.url ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                    }
                    alt={""}
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-3">
                  <span className="font-normal text-sm">{variant.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Form {...form}>
            <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <h2>Options</h2>
              <div className="flex justify-between items-end mb-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {images?.length! > 0 ? (
                          <div className="flex gap-3 flex-wrap">
                            {images?.map((img, i) => (
                              <div
                                key={img.name}
                                className="overflow-hidden relative aspect-video h-[150px] w-[150px]"
                              >
                                <Image
                                  fill
                                  sizes="30"
                                  src={img.url}
                                  alt="product image"
                                  className="rounded-md object-cover"
                                />
                                <Button
                                  onClick={() => handleImageDelete(img.key)}
                                  type="button"
                                  variant={"ghost"}
                                  size={"icon"}
                                  className="absolute right-[-1px] top-0"
                                >
                                  {imageIsDeleting ? <Loader2 /> : <XCircle />}
                                </Button>
                              </div>
                            ))}
                            <UploadButton
                              endpoint="imageUploader"
                              appearance={{
                                button:
                                  "bg-transparent text-black hover:underline h-[30px]",
                                allowedContent: "hidden",
                              }}
                              onClientUploadComplete={(res) => {
                                setImages((prevImages) => {
                                  if (prevImages && prevImages.length > 0) {
                                    return [...prevImages, ...res];
                                  } else {
                                    return res;
                                  }
                                });
                                toast({
                                  variant: "success",
                                  description: "Upload Completed",
                                });
                              }}
                              onUploadError={(error: Error) => {
                                toast({
                                  variant: "destructive",
                                  description: `ERROR! ${error.message}`,
                                });
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="w-fit flex flex-col items-center">
                              <div className="relative mb-5">
                                <Image
                                  priority
                                  width={100}
                                  height={100}
                                  src={
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                                  }
                                  alt={""}
                                  className="rounded-md"
                                />
                              </div>
                              <UploadButton
                                endpoint="imageUploader"
                                appearance={{
                                  button:
                                    "bg-transparent text-black hover:underline h-[30px]",
                                  allowedContent: "hidden",
                                }}
                                onClientUploadComplete={(res) => {
                                  setImages((prevImages) => {
                                    if (prevImages && prevImages.length > 0) {
                                      return [...prevImages, ...res];
                                    } else {
                                      return res;
                                    }
                                  });
                                  toast({
                                    variant: "success",
                                    description: "Upload Completed",
                                  });
                                }}
                                onUploadError={(error: Error) => {
                                  toast({
                                    variant: "destructive",
                                    description: `ERROR! ${error.message}`,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <h2>Pricing</h2>
              <div className="flex items-center gap-5">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal">Price</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comparePriceAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare-at price</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <h2 className="font-semibold mb-3">Inventory</h2>
              <div className="flex items-center gap-5">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventoryQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
              <h2 className="font-semibold mb-3">Shipping</h2>

              <label
                htmlFor="shippingBox"
                className="flex gap-2 items-center cursor-pointer text-xs font-medium"
              >
                <Checkbox
                  id="shippingBox"
                  checked={shipping}
                  onCheckedChange={() => setShipping(!shipping)}
                />
                Requires shipping
              </label>
              {variant?.requiresShipping ? (
                <div className="flex items-end gap-5 mt-3">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-background px-5">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a weight unit"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {weightUnitsArray.map((unit) => {
                              return (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
            </div>
          </Form>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button
          disabled={isLoading}
          className="max-w-[150px] h-[30px]"
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4" /> Updating...
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" /> Update variant
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditVariantForm;
