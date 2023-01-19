import { Router } from "express";
import { loginUser } from "./handlers";

const AuthenticationRouter = Router();

AuthenticationRouter.post("/login", loginUser);
AuthenticationRouter.post("/register");

export default AuthenticationRouter;