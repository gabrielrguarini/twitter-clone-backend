import { prisma } from "../utils/prisma";

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
    tweet.user.avatar = `${process.env.BASE_URL}/${tweet.user.avatar}`;
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
