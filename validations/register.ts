import { z } from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});
