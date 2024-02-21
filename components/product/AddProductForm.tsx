"use client";
import * as z from "zod";
import { createProductSchema } from "@/validations/createProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as prisImg, Product, Variant } from "@prisma/client";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader2,
  Loader2Icon,
  Pencil,
  PencilLine,
  Plus,
  Trash2,
  Trash2Icon,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  cn,
  formatPrice,
  productCategories,
  ProductStatus,
  productStatuses,
  WeightUnits,
  weightUnitsArray,
} from "@/lib/utils";
import { UploadButton } from "../uploadthing";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import Modal from "../Modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface AddProductFormProps {
  product: ProductWithVariants | null;
  variants?: any;
}
export type ProductWithVariants = Product & {
  variants: Variant[];
};

const AddProductForm = ({ product, variants }: AddProductFormProps) => {
  const useDynamicForm = () => {
    const form = useForm<z.infer<typeof createProductSchema>>({
      resolver: zodResolver(createProductSchema),
      defaultValues: product || {
        images: undefined,
        taxable: true,
        weightUnit: WeightUnits.LB,
        status: ProductStatus.DRAFT,
        comparePriceAt: 0,
        description: "",
        price: 0,
        productCategory: "",
        productType: "",
        sku: "",
        totalInventory: 0,
        weight: 0,
        options: [],
        title: "",
      },
    });
    function onSubmit(values: z.infer<typeof createProductSchema>) {
      const finalData = {
        ...values,
        available: values.status === "Draft" ? false : true,
        collections: [],
        requiresShipping: shipping,
        totalVariants: product?.variants?.length || 0,
      };

      setIsLoading(true);
      if (product) {
        // update
        axios
          .patch(`/api/product/${product.id}`, finalData)
          .then((res) => {
            toast({
              variant: "success",
              description: "Product updated",
            });

            setIsLoading(false);
            router.push(`/products/${res.data.id}`);
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
      } else {
        //create
        axios
          .post("/api/product", finalData)
          .then((res) => {
            toast({
              variant: "success",
              description: "Product created",
            });
            router.push(`/products/${res.data.id}`);
            setIsLoading(false);
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
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "options",
    });

    const handleRemove = (index: number) => {
      remove(index);
    };
    const handleAppend = () => {
      append({ name: "" });
    };
    return { form, fields, onSubmit, handleRemove, handleAppend };
  };
  const { fields, form, handleAppend, handleRemove, onSubmit } =
    useDynamicForm();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<prisImg[] | undefined>(product?.images);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [shipping, setShipping] = useState(true);
  const [open, setOpen] = useState(false);
  const [leave, setLeave] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) {
      form.setValue("images", images, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [form, images]);

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

  const handleProductDelete = async (productId: string) => {
    try {
      await axios.delete(`/api/product/${productId}`).then((res) => {
        setOpen(!open);
        toast({
          variant: "success",
          description: "Product deleted",
        });
      });
      router.push("/products");
    } catch (error: any) {
      console.log(error);
      setOpen(!open);
      toast({
        variant: "destructive",
        description: `Product deletion could not be completed ${error.message}`,
      });
    }
    const imageKeys = product?.images.map((imgKey) => {
      return imgKey.key;
    });
    axios.post("/api/uploadthing/delete", { imageKeys: [imageKeys] });
  };

  const handleLeavePage = () => {
    if (pathname === "/products/new") {
      if (Object.keys(form.formState.touchedFields).length > 0) {
        setLeave(!leave);
      } else {
        router.push("/products");
      }
    } else {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        setLeave(!leave);
      } else {
        router.push("/products");
      }
    }
  };
  return (
    <div>
      <div className="flex items-center mb-5">
        <Dialog open={leave} onOpenChange={setLeave}>
          <Button
            type="button"
            variant={"ghost"}
            onClick={handleLeavePage}
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
                  onClick={() => setLeave(!leave)}
                >
                  Stay
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                size={"sm"}
                onClick={() => {
                  setLeave(!leave);
                  router.push("/products");
                }}
                className="h-[35px]"
              >
                Leave page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="font-bold text-2xl ml-2">
          {product ? product.title : "Add product"}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <div className="flex justify-between flex-col lg:flex-row">
            <div className="flex flex-1 flex-col sm:mr-5">
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Short sleeve t-shirt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Product description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={10} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Media</h2>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {images ? (
                          <div>
                            <div
                              className={
                                images.length > 0
                                  ? "grid grid-cols-4 gap-4 col-span-2"
                                  : ""
                              }
                            >
                              {images.map((img, i) => (
                                <div
                                  key={img.name}
                                  className={`border border-slate-300 rounded-md relative aspect-square ${
                                    i === 0 ? "row-span-2 col-span-2" : ""
                                  }`}
                                >
                                  <Image
                                    width={100}
                                    height={100}
                                    src={img.url}
                                    alt="product image"
                                    className="w-[100%] h-[100%] rounded-md"
                                    priority
                                  />
                                  <Button
                                    onClick={() => handleImageDelete(img.key)}
                                    type="button"
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="absolute right-[-1px] top-0 m-2"
                                  >
                                    {imageIsDeleting ? (
                                      <Loader2 />
                                    ) : (
                                      <XCircle />
                                    )}
                                  </Button>
                                </div>
                              ))}
                              <div className="border border-dashed outline-gray-400 p-4 rounded-lg transition hover:bg-stone-100 bg-stone-50 flex justify-center items-center">
                                <UploadButton
                                  endpoint="imageUploader"
                                  appearance={{
                                    button:
                                      "bg-gray-50 text-black border-2 border-gray-200 shadow-md rounded hover:bg-stone-100 w-fit px-4",
                                    allowedContent: "hidden",
                                  }}
                                  content={{
                                    button({ ready }) {
                                      if (ready) return <div>Add</div>;

                                      return "";
                                    },
                                    allowedContent({ ready, isUploading }) {
                                      if (!ready)
                                        return "Checking what you allow";
                                      if (isUploading) return "Loading...";
                                      return "Images up to 16MB";
                                    },
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
                          </div>
                        ) : (
                          <div className="border border-dashed outline-gray-400 py-8 rounded-lg transition hover:bg-stone-100 bg-stone-50">
                            <UploadButton
                              endpoint="imageUploader"
                              appearance={{
                                button:
                                  "bg-gray-50 text-black border-2 border-gray-200 shadow-md rounded-xl hover:bg-stone-100",
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
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Pricing</h2>
                <div className="flex items-center gap-5">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-normal">Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="$ 0.00"
                            {...field}
                            type="number"
                          />
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
                          <Input
                            placeholder="$ 0.00"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="taxable"
                  render={({ field }) => (
                    <FormItem className="flex items-end space-x-2 mt-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs cursor-pointer">
                        Charge tax on this product
                      </FormLabel>
                    </FormItem>
                  )}
                />
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
                    name="totalInventory"
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
                {shipping ? (
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

              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Variants</h2>

                <div className="px-8 flex flex-col gap-3">
                  {fields.map(({ id }, index) => (
                    <FormField
                      key={id}
                      control={form.control}
                      name={`options.${index}.name`}
                      render={({ field }) => (
                        <div className="flex justify-between items-center ">
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Add options like color or size..."
                                className="h-[30px]"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                          <div>
                            <Button
                              variant={"outline"}
                              type="button"
                              onClick={() => handleRemove(index)}
                              className="ml-5 h-[30px]"
                            >
                              <Trash2Icon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      )}
                    />
                  ))}
                  <div>
                    <Button
                      variant={"link"}
                      type="button"
                      onClick={handleAppend}
                      className="text-sky-600 hover:text-sky-800 p-0"
                    >
                      <Plus className="h-4 w-4" />
                      {fields.length === 0
                        ? "Add an option like size or color"
                        : "Add another option"}
                    </Button>
                  </div>
                </div>

                {product && product.variants.length > 0 && (
                  <div>
                    <Accordion type="single" collapsible className="w-full ">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="hover:bg-gray-200 p-2">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex gap-3 w-full">
                              <div className="aspect-square overflow-hidden relative h-[70px] rounded-lg">
                                <Image
                                  fill
                                  sizes="30"
                                  src={
                                    product.images[0]?.url ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                                  }
                                  alt="product title"
                                  className="object-cover"
                                />
                              </div>

                              <div>
                                <div>{product.title}</div>
                                <span className="text-sm font-normal text-muted-foreground">
                                  {product.variants.length} variants
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 text-xs">
                              <span className="text-xs text-muted-foreground">
                                Total available {product.totalInventory}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {product.variants.map((variant) => {
                            return (
                              <div
                                key={variant.id}
                                className="flex items-center gap-3"
                              >
                                <div className="flex flex-col w-full">
                                  <div
                                    onClick={() =>
                                      router.push(
                                        `/products/${product.id}/variants/${variant.id}`
                                      )
                                    }
                                    className="flex items-center justify-between gap-3 hover:bg-gray-200 hover:cursor-pointer p-1"
                                  >
                                    <div className="flex items-center gap-3 pl-6">
                                      <div className="aspect-square overflow-hidden relative h-[55px] rounded-lg">
                                        <Image
                                          fill
                                          sizes="30"
                                          src={
                                            variant?.images[0]?.url ||
                                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
                                          }
                                          alt="prod alt"
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-semibold">
                                          {variant.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {variant.sku}
                                        </span>
                                      </div>
                                    </div>
                                    <div>{formatPrice(variant.price)}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {variant.inventoryQuantity} available
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-[50%] lg:w-[35%]">
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Status</h2>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a status"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {productStatuses.map((status) => {
                            return (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full rounded-lg overflow-hidden bg-white p-4 border-2 border-gray-200 shadow-lg mb-5">
                <h2 className="font-semibold mb-3">Product organization</h2>
                <FormField
                  control={form.control}
                  name="productCategory"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Product category</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? productCategories.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : "Select category"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command className="h-[300px] w-[300px] lg:w-[250px] xl:w-[350px]">
                            <CommandInput placeholder="Search language..." />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup className="overflow-y-auto">
                              {productCategories.map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue(
                                      "productCategory",
                                      category.value
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product type</FormLabel>
                      <FormControl>
                        <Input placeholder="Add custom category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          {product ? (
            <div className="flex items-center justify-end gap-3">
              <Button disabled={isLoading} className="max-w-[150px] h-[30px]">
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2Icon className="mr-2 h-4 w-4" /> Updating
                  </span>
                ) : (
                  <span className="flex items-center">
                    <PencilLine className="mr-2 h-4 w-4" /> Update product
                  </span>
                )}
              </Button>
              <Modal
                onConfirm={() => handleProductDelete(product.id)}
                icon={<Trash2 className="h-4 w-4 mr-2" />}
                triggerTitle="Delete product"
                cancelTitle="Cancel"
                confirmTitle="Delete product"
                title={`Delete ${product.title}?`}
                description={`Are you sure you want to delete the product ${product.title}? This can't be undone.`}
                btnClasses="bg-destructive hover:bg-rose-800 h-[30px] rounded-lg px-2 text-white text-sm flex items-center"
              />
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <Button disabled={isLoading} className="max-w-[150px] h-[30px]">
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4" /> Creating...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" /> Create product
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddProductForm;
