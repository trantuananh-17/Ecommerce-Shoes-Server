import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.registerController);
authRouter.post("/verify", authController.verifyEmailController);

export default authRouter;
