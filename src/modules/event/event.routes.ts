import { Router } from "express";
import { EventController } from "./event.controller";

const eventRouter = Router();
const eventController = new EventController();

eventRouter.post("/", eventController.createEventController);

export default eventRouter;
