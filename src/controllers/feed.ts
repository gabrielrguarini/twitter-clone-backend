import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { feedSchema } from "../schemas/feed";
import { getUserFollowing } from "../services/user";
import { findTweetFeed } from "../services/tweet";

export const getFeed = async (req: ExtendedRequest, res: Response) => {
  const safeData = feedSchema.safeParse(req.body);
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const perPage = 10;
  const currentPage = safeData.data.page ?? 0;

  const following = await getUserFollowing(req.userSlug as string);

  const tweets = await findTweetFeed(following, currentPage, perPage);
  res.json({ tweets, currentPage });
};
