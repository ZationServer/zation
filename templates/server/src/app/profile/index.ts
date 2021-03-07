import { Router } from "zation-server";
import ProfileDatabox from "./ProfileDatabox";

export const profileRouter = new Router('profile');

profileRouter.use(ProfileDatabox);