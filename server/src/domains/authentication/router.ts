import { Router } from "express";
import { loginUser, registerUser } from "./handlers";

const AuthenticationRouter = Router();

AuthenticationRouter.post("/login", loginUser);
AuthenticationRouter.post("/register", registerUser);

export default AuthenticationRouter;