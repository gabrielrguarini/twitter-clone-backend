import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { searchSchema } from "../schemas/search";
import { findTweetsByBody } from "../services/tweet";

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
  const safeData = searchSchema.safeParse(req.query);
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const perPage = 10;
  const currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByBody(safeData.data.q, currentPage, perPage);
  res.json({ tweets, currentPage });
};
