import slug from "slug";
import { z } from "zod";

export const addTweetSchema = z.object({
  body: z.string({ message: "Precisa enviar algo..." }),
  answer: z.string().optional(),
});
