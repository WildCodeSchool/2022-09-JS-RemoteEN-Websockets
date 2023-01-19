import { Router } from "express";
import AuthenticationRouter from "./domains/authentication/router";
import MessagingRouter from "./domains/messaging/router";

const MainRouter = Router();

MainRouter.use("/auth", AuthenticationRouter);
MainRouter.use("/messages", MessagingRouter);

export default MainRouter;