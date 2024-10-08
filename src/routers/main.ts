import { Router } from "express";
import { ping, privatePing } from "../controllers/ping";
import { singin, singup } from "../controllers/auth";
import { verifyJWT } from "../utils/jwt";
import { addTweet } from "../controllers/tweet";

export const mainRouter = Router();

mainRouter.get("/ping", ping);
mainRouter.get("/privateping", verifyJWT, privatePing);

mainRouter.post("/auth/singup", singup);
mainRouter.post("/auth/singin", singin);

mainRouter.post("/tweet", verifyJWT, addTweet);
// mainRouter.get("/tweet/:id");
// mainRouter.get("/tweet/:id/answers");
// mainRouter.post("/tweet/:id/like");

// mainRouter.get("user/:slug");
// mainRouter.get("user/:slug/tweets");
// mainRouter.post("user/:slug/follow");
// mainRouter.put("/user");
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

// mainRouter.get("/feed");
// mainRouter.get("/search");
// mainRouter.get("/trending");
// mainRouter.get("/suggestions");
