import { Router } from "zation-server";
import GetProfile from "./GetProfile";

export const profileRouter = new Router('profile');

profileRouter.use(GetProfile);