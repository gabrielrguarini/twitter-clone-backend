import { Router } from "express";
import { ping, privatePing } from "../controllers/ping";
import { singin, singup } from "../controllers/auth";
import { verifyJWT } from "../utils/jwt";
import {
  addTweet,
  getAnswers,
  getTweet,
  likeToggle,
} from "../controllers/tweet";
import {
  followToggle,
  getUser,
  getUserTweets,
  updateUser,
} from "../controllers/user";
import { getFeed } from "../controllers/feed";
import { searchTweets } from "../controllers/search";
import { getTrends } from "../controllers/trend";
import { getSuggestions } from "../controllers/suggestions";

export const mainRouter = Router();

mainRouter.get("/ping", ping);
mainRouter.get("/privateping", verifyJWT, privatePing);

mainRouter.post("/auth/singup", singup);
mainRouter.post("/auth/singin", singin);

mainRouter.post("/tweet", verifyJWT, addTweet);
mainRouter.get("/tweet/:id", verifyJWT, getTweet);
mainRouter.get("/tweet/:id/answers", verifyJWT, getAnswers);
mainRouter.post("/tweet/:id/like", verifyJWT, likeToggle);

mainRouter.get("/user/:slug", verifyJWT, getUser);
mainRouter.get("/user/:slug/tweets", verifyJWT, getUserTweets);
mainRouter.post("/user/:slug/follow", verifyJWT, followToggle);
mainRouter.put("/user", verifyJWT, updateUser);
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

mainRouter.get("/feed", verifyJWT, getFeed);
mainRouter.get("/search", verifyJWT, searchTweets);
mainRouter.get("/trending", verifyJWT, getTrends);
mainRouter.get("/suggestions", verifyJWT, getSuggestions);
