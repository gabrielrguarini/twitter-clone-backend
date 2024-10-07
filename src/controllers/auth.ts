import { RequestHandler } from "express";
import { singupSchema } from "../schemas/singup";

export const singup: RequestHandler = async (req, res) => {
  try {
    const safeData = singupSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
