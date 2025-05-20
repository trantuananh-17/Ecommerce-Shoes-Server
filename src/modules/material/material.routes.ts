import { Router } from "express";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import { MaterialController } from "./material.controller";

const materialRouter = Router();
const materialController = new MaterialController();

materialRouter.get(
  "/",
  paginationMiddleware(),
  materialController.getAllMaterialController
);
materialRouter.post("/", materialController.createMaterialController);
materialRouter.put("/:id", materialController.updateMaterialController);
export default materialRouter;
