import { Router } from "express";
import { ClosureController } from "./closure.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const closureRouter = Router();
const closureController = new ClosureController();

closureRouter.get(
  "/",
  paginationMiddleware(),
  closureController.getAllClosureController
);
closureRouter.post("/", closureController.createClosureController);
closureRouter.put("/:id", closureController.updateClosureController);

export default closureRouter;
