import { z } from "zod";

export const searchSchema = z.object({
  q: z
    .string({ message: "Precisa enviar algo..." })
    .min(3, "Precisa enviar pelo menos 3 caracteres"),
  page: z.coerce.number().min(0).optional(),
});
