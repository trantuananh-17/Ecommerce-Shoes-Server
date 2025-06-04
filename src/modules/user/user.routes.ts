import { Router } from "express";
import { UserController } from "./user.controller";
import AuthRole from "../../middleware/auth.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get(
  "/",
  AuthRole("user", true),
  userController.getUserProfileController
);

userRouter.put(
  "/",
  AuthRole("user", true),
  userController.updateUserController
);

userRouter.patch("/", AuthRole("admin"), userController.updateActiveController);

export default userRouter;
