import { Router } from "express";
import { AuthController } from "./auth.controller";
import AuthRole from "../../middleware/auth.middleware";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
authRouter.post("/refresh", authController.refreshTokenController);
authRouter.post("/logout", authController.logoutController);
authRouter.get("/verify", authController.verifyEmailController);
authRouter.patch(
  "/change-password/:id",
  AuthRole("*", true),
  authController.changePasswordMeController
);
authRouter.post(
  "/forgot",
  AuthRole("*", true, true),
  authController.forgotPasswordController
);
authRouter.post(
  "/reset-password",
  AuthRole("*", true, true),
  authController.resetPasswordController
);

export default authRouter;
