import { z } from "zod";

export const editVariantSchema = z.object({
  title: z.string().min(1, {
    message: "Option name be at least 2 characters long",
  }),
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
  price: z.coerce.number().int().optional(),
  comparePriceAt: z.coerce.number().int().optional(),
  inventoryQuantity: z.coerce.number().int().optional(),
  sku: z.string().optional(),
  weight: z.coerce.number().int().optional(),
  weightUnit: z.string().optional(),
});
