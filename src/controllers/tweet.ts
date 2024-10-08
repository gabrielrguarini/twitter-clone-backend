import { addTweetSchema } from "../schemas/add-tweet";
import { addHashtag } from "../services/trends";
import {
  checkIfTweetIsLikedByUser,
  createTweet,
  findAnswersFromTweet,
  findTweet,
  likeTweet,
  unlikeTweet,
} from "../services/tweet";
import { ExtendedRequest } from "../types/extended-request";
import { Response } from "express";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
    if (!hasAnswerTweet) {
      res.status(404).json({ error: "Tweet não encontrado" });
      return;
    }
  }

  const newTweet = await createTweet(
    req.userSlug,
    safeData.data.body,
    safeData.data.answer ? parseInt(safeData.data.answer) : 0
  );

  const hashTags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
  if (hashTags) {
    for (const hashTag of hashTags) {
      if (hashTag.length > 2) {
        await addHashtag(hashTag);
      }
    }
  }
  res.json({ tweet: newTweet });
};

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const tweet = await findTweet(parseInt(id));
  if (!tweet) {
    res.json({ error: "Tweet não encontrado" });
    return;
  }
  res.json({ tweet });
};

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const answers = await findAnswersFromTweet(parseInt(id));

  res.json({ answers });
};

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const liked = await checkIfTweetIsLikedByUser(req.userSlug, parseInt(id));

  if (liked) {
    await unlikeTweet(req.userSlug, parseInt(id));
  } else {
    await likeTweet(req.userSlug, parseInt(id));
  }
  res.status(200).json({ success: true });
};
