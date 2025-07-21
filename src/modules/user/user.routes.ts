import { Router } from "express";
import { UserController } from "./user.controller";
import AuthRole from "../../middleware/auth.middleware";
import upload from "../../middleware/upload.middleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["user"]),
  userController.getUserProfileController
);

userRouter.put(
  "/",
  authMiddleware,
  roleMiddleware(["user"]),
  userController.updateUserController
);

userRouter.patch(
  "/",
  authMiddleware,
  roleMiddleware(["user"]),
  userController.updateActiveController
);
userRouter.patch(
  "/avatar",
  authMiddleware,
  roleMiddleware(["user"]),
  upload.single("image"),
  userController.createAndUpdateAvatarController
);

userRouter.delete(
  "/avatar",
  authMiddleware,
  roleMiddleware(["user"]),
  upload.single("image"),
  userController.deleteAvatarController
);

export default userRouter;
