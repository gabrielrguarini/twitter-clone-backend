import { z } from "zod";

export const singinSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(4, { message: "Senha deve ter pelo menos 4 caracteres" }),
});
