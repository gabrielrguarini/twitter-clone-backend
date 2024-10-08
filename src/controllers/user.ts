import {
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user";
import { ExtendedRequest } from "../types/extended-request";
import { Response } from "express";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const user = await findUserBySlug(slug);
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

  const followingCount = await getUserFollowingCount(user.slug);
  const followersCount = await getUserFollowersCount(user.slug);
  const tweetCount = await getUserTweetCount(user.slug);

  res.json({
    user,
    followersCount,
    followingCount,
    tweetCount,
  });
};
