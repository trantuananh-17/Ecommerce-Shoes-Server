import { Router } from "express";
import { EventController } from "./event.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const eventRouter = Router();
const eventController = new EventController();

eventRouter.post("/", eventController.createEventController);
eventRouter.put("/:id", eventController.updateEventController);
eventRouter.patch("/:id", eventController.updateEventActiveController);
eventRouter.get(
  "/",
  paginationMiddleware(),
  eventController.getEventsController
);

export default eventRouter;
