import { updateUserSchema } from "../schemas/update-user";
import { userTweetsSchema } from "../schemas/user-tweets";
import { findTweetsByUser } from "../services/tweet";
import {
  checkIfFollows,
  findUserBySlug,
  follow,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
  unFollow,
  updateUserInfo,
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

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;
  const safeData = userTweetsSchema.safeParse(req.query);
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const perPage = 10;
  const currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByUser(slug, currentPage, perPage);

  res.json({ tweets, page: currentPage });
};

export const followToggle = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;
  const me = req.userSlug as string;

  const hasUserToBeFollowed = await findUserBySlug(slug);

  if (!hasUserToBeFollowed) {
    res.json({ error: "Usuário não encontrado" });
    return;
  }
  const follows = await checkIfFollows(me, slug);
  if (!follows) {
    await follow(me, slug);
    res.json({ following: true });
    return;
  }
  await unFollow(me, slug);
  res.json({ following: false });
};

export const updateUser = async (req: ExtendedRequest, res: Response) => {
  const me = req.userSlug as string;
  const safeData = updateUserSchema.safeParse(req.body);

  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  await updateUserInfo(me, safeData.data);
  res.json({ success: true });
};
