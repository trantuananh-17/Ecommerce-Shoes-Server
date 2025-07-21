import { Router } from "express";
import { ClosureController } from "./closure.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const closureRouter = Router();
const closureController = new ClosureController();

closureRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  closureController.getAllClosureController
);
closureRouter.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  closureController.getAllClosureByAdminController
);
closureRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  closureController.createClosureController
);
closureRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  closureController.updateClosureController
);

export default closureRouter;
