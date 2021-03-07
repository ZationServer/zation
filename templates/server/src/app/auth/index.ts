import { Router } from "zation-server";
import LoginController from "./LoginController";

export const authRouter = new Router('auth');

authRouter.use(LoginController);