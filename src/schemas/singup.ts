import { z } from "zod";

export const singupSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(4, { message: "Senha deve ter pelo menos 4 caracteres" }),
});
