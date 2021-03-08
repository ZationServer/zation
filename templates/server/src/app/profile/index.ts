import { Router } from "zation-server";
import GetDatabox from "./GetDatabox";

export const profileRouter = new Router('profile');

profileRouter.use(GetDatabox);