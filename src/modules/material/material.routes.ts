import { Router } from "express";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import { MaterialController } from "./material.controller";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const materialRouter = Router();
const materialController = new MaterialController();

materialRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  materialController.getAllMaterialController
);

materialRouter.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  materialController.getAllMaterialByAdminController
);
materialRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  materialController.createMaterialController
);
materialRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  materialController.updateMaterialController
);
export default materialRouter;
