import { Router } from "zation-server";
import Login from "./Login";

export const authRouter = new Router('auth');

authRouter.use(Login);