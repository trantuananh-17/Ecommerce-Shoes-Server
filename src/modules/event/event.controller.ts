import { Request, Response } from "express";
import { EventService, EventServiceImpl } from "./event.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { eventSchema } from "./event.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";

export class EventController {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = new EventServiceImpl();
  }

  createEventController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = eventSchema.validate(req.body ?? {});
        const lang = req.lang || "vi";

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.eventService.createEventService(
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createEventController"
    );
  };

  updateEventController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = eventSchema.validate(req.body ?? {});
        const lang = req.lang || "vi";
        const productId = req.params.id;

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.eventService.updateEventService(
          productId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createEventController"
    );
  };

  updateEventActiveController = async (
    req: Request,
    res: Response
  ): Promise<any> => {};

  getEventsController = async (req: Request, res: Response): Promise<any> => {};

  getEventInfoController = async (
    req: Request,
    res: Response
  ): Promise<any> => {};
}
