import { Router } from "express";
import { UserController } from "./user.controller";
import AuthRole from "../../middleware/auth.middleware";
import upload from "../../middleware/upload.middleware";

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
userRouter.patch(
  "/avatar",
  AuthRole("*", true),
  upload.single("image"),
  userController.createAndUpdateAvatarController
);

userRouter.delete(
  "/avatar",
  AuthRole("*", true),
  upload.single("image"),
  userController.deleteAvatarController
);

export default userRouter;
