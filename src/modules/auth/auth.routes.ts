import { Router } from "express";
import { AuthController } from "./auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
authRouter.get("/verify", authController.verifyEmailController);
authRouter.patch(
  "/change-password/:id",
  authController.changePasswordMeController
);
authRouter.post("/forgot", authController.forgotPasswordController);
authRouter.post("/reset-password", authController.resetPasswordController);

export default authRouter;
