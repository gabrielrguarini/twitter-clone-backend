import { z } from "zod";

export const updateUserSchema = z.object({
  slug: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  bio: z.string().optional(),
  link: z.string().url("Link inválido").optional(),
});
