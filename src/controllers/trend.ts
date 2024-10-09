import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getTrending } from "../services/trends";

export const getTrends = async (req: ExtendedRequest, res: Response) => {
  const trends = await getTrending();
  res.json({ trends });
};
