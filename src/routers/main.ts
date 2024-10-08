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
import { getUser } from "../controllers/user";

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
// mainRouter.get("/user/:slug/tweets");
// mainRouter.post("/user/:slug/follow");
// mainRouter.put("/user");
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

// mainRouter.get("/feed");
// mainRouter.get("/search");
// mainRouter.get("/trending");
// mainRouter.get("/suggestions");
