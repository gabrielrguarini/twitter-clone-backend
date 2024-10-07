import { Router } from "express";
import { ping } from "../controllers/ping";

export const mainRouter = Router();

mainRouter.get("/ping", ping);
