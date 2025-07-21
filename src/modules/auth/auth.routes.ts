import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";
import { AuthController } from "./auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
authRouter.post("/refresh", authController.refreshTokenController);
authRouter.post("/logout", authController.logoutController);
authRouter.get(
  "/me",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  authController.getUserInfoController
);
authRouter.get("/verify", authController.verifyEmailController);
authRouter.patch(
  "/change-password/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  authController.changePasswordMeController
);
authRouter.post(
  "/forgot",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  authController.forgotPasswordController
);
authRouter.post(
  "/reset-password",

  authController.resetPasswordController
);

export default authRouter;
