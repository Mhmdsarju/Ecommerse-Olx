import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .regex(/^[A-Za-z0-9\s]+$/, "Title can only contain letters and numbers")
    .regex(/^\S+$/, "Password cannot contain spaces"),

  price: z
    .string()
    .regex(/^\d+$/, "Price must be a valid number"),

  location: z
    .string()
    .min(3, "Location must be at least 3 characters"),
  
  image: z
    .instanceof(File, { message: "Image is required" })
});
