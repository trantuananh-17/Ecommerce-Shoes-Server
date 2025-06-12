import { Request, Response } from "express";
import { EventService, EventServiceImpl } from "./event.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";

export class EventController {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = new EventServiceImpl();
  }

  createEventController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        // const { error, value } = brandValidate.validate(req.body ?? {});
        // const lang = req.lang || "vi";

        // if (error) {
        //   handleValidationError(res, error, req.__.bind(req));
        //   return;
        // }

        const response = await this.eventService.createEventService(
          req.body,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createEventController"
    );
  };

  updateEventController = async (
    req: Request,
    res: Response
  ): Promise<any> => {};

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
