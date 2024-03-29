import { z } from "zod";

export const createCustomerFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .optional(),
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .optional(),
  phone: z.string(),
  addresses: z
    .array(
      z.object({
        line1: z.string(),
        line2: z.string().optional(),
        city: z.string(),
        country: z.string(),
        countryCode: z.string(),
        apartment: z.string().optional(),
        postal_code: z.string(),
        state: z.string(),
        firstName: z.string(),
        lastName: z.string().optional(),
        fullName: z.string(),
        phone: z.string(),
        street: z.string(),
        userId: z.string().optional(),
      })
    )
    .optional(),
});
