import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { getPublicURL } from "../utils/url";
import { hash } from "bcrypt-ts";

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) return null;
  return {
    ...user,
    avatar: getPublicURL(user.avatar),
    cover: getPublicURL(user.cover),
  };
};

export const findUserBySlug = async (slug: string) => {
  const user = await prisma.user.findUnique({
    where: {
      slug,
    },
    select: {
      avatar: true,
      cover: true,
      name: true,
      slug: true,
      bio: true,
      link: true,
    },
  });
  if (!user) return null;
  return {
    ...user,
    avatar: getPublicURL(user.avatar),
    cover: getPublicURL(user.cover),
  };
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({ data });
  return {
    ...newUser,
    avatar: getPublicURL(newUser.avatar),
    cover: getPublicURL(newUser.cover),
  };
};

export const getUserFollowingCount = async (slug: string) => {
  const count = await prisma.follow.count({
    where: {
      user1Slug: slug,
    },
  });
  return count;
};
export const getUserFollowersCount = async (slug: string) => {
  const count = await prisma.follow.count({
    where: {
      user2Slug: slug,
    },
  });
  return count;
};
export const getUserTweetCount = async (slug: string) => {
  const count = await prisma.tweet.count({
    where: {
      userSlug: slug,
    },
  });
  return count;
};
