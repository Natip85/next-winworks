import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().optional(),
  price: z.coerce.number().int().optional(),
  totalInventory: z.coerce.number().int().optional(),
  comparePriceAt: z.coerce.number().int().optional(),
  weight: z.coerce.number().int().optional(),
  weightUnit: z.string().optional(),
  taxable: z.boolean().default(true),
  sku: z.string().optional(),
  status: z.string().optional(),
  productCategory: z.string().optional(),
  productType: z.string().optional(),
  images: z
    .array(
      z.object({
        key: z.string(),
        name: z.string(),
        url: z.string(),
        size: z.number(),
        serverData: z.object({
          uploadedBy: z.string(),
        }),
      })
    )
    .optional(),
  options: z.array(
    z.object({
      name: z.string().min(1, { message: "Option name is required" }),
    })
  ),
});
