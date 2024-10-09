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

export const checkIfFollows = async (user1Slug: string, user2Slug: string) => {
  const follows = await prisma.follow.findFirst({
    where: {
      user1Slug,
      user2Slug,
    },
  });
  return follows ? true : false;
};

export const follow = async (user1Slug: string, user2Slug: string) => {
  await prisma.follow.create({
    data: {
      user1Slug,
      user2Slug,
    },
  });
};

export const unFollow = async (user1Slug: string, user2Slug: string) => {
  await prisma.follow.deleteMany({
    where: {
      user1Slug,
      user2Slug,
    },
  });
};

export const updateUser = async (
  slug: string,
  data: Prisma.UserUpdateInput
) => {
  const updatedUser = await prisma.user.update({
    where: {
      slug,
    },
    data,
  });
  return {
    ...updatedUser,
    avatar: getPublicURL(updatedUser.avatar),
    cover: getPublicURL(updatedUser.cover),
  };
};

export const updatePassword = async (slug: string, password: string) => {
  const hashPassword = await hash(password, 10);
  await prisma.user.update({
    where: {
      slug,
    },
    data: {
      password: hashPassword,
    },
  });
};

export const updateUserInfo = async (
  slug: string,
  data: Prisma.UserUpdateInput
) => {
  const user = await prisma.user.update({
    where: {
      slug,
    },
    data,
  });
};

export const getUserFollowing = async (slug: string) => {
  const following = [];
  const reqFollow = await prisma.follow.findMany({
    where: { user1Slug: slug },
    select: { user2Slug: true },
  });

  for (let reqItem of reqFollow) {
    following.push(reqItem.user2Slug);
  }
  return following;
};

export const getUserSuggestions = async (slug: string) => {
  const following = await getUserFollowing(slug);
  const followingPlusMe = [...following, slug];

  type Suggestion = Pick<
    Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
    "name" | "avatar" | "slug"
  >;

  const suggestions: Suggestion[] = await prisma.$queryRaw`
    SELECT 
      name, avatar, slug
      FROM "User"
      WHERE
      slug NOT IN (${followingPlusMe.join(",")})
      ORDER BY RANDOM()
      LIMIT 2
  `;

  for (const sugIndex in suggestions) {
    suggestions[sugIndex].avatar = getPublicURL(suggestions[sugIndex].avatar);
  }
  return suggestions;
};
