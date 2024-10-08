import { get } from "http";
import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";
import slug from "slug";

export const findTweet = async (id: number) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          slug: true,
          avatar: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
  });
  if (tweet) {
    tweet.user.avatar = getPublicURL(tweet.user.avatar);
    return tweet;
  }
  return null;
};

export const createTweet = async (
  userSlug: string,
  body: string,
  answerId: number
) => {
  const newTweet = await prisma.tweet.create({
    data: {
      body,
      userSlug,
      answerOf: answerId ?? 0,
    },
  });
  return newTweet;
};

export const findAnswersFromTweet = async (id: number) => {
  const tweets = await prisma.tweet.findMany({
    where: {
      answerOf: id,
    },
    include: {
      user: {
        select: {
          name: true,
          slug: true,
          avatar: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
  });

  for (const tweetIndex in tweets) {
    tweets[tweetIndex].user.avatar = getPublicURL(
      tweets[tweetIndex].user.avatar
    );
  }
  return tweets;
};

export const checkIfTweetIsLikedByUser = async (slug: string, id: number) => {
  const isLiked = await prisma.tweetLike.findFirst({
    where: {
      userSlug: slug,
      tweetId: id,
    },
  });

  return isLiked ? true : false;
};

export const unlikeTweet = async (slug: string, id: number) => {
  await prisma.tweetLike.deleteMany({
    where: {
      userSlug: slug,
      tweetId: id,
    },
  });
};

export const likeTweet = async (slug: string, id: number) => {
  await prisma.tweetLike.create({
    data: {
      userSlug: slug,
      tweetId: id,
    },
  });
};
