import { Router } from "zation-server";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";

const rootRouter = new Router();

rootRouter.use(authRouter);
rootRouter.use(profileRouter);

rootRouter.register();