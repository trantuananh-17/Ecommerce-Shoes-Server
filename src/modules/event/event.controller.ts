import { Request, Response } from "express";
import { EventService, EventServiceImpl } from "./event.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { eventSchema, updateEventActiveValidate } from "./event.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";

export class EventController {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = new EventServiceImpl();
  }

  createEventController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = eventSchema.validate(req.body ?? {});

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
  ): Promise<any> => {
    tryCatchController(
      async () => {
        const eventId = req.params.id;
        const { error, value } = updateEventActiveValidate.validate(
          req.body ?? {}
        );

        if (!isValidObjectId(eventId)) {
          return errorRes(
            res,
            req.__("INVALID_BRAND_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.eventService.updateEventActiveService(
          eventId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateEventActiveController"
    );
  };

  getEventsController = async (req: Request, res: Response): Promise<any> => {
    tryCatchController(
      async () => {
        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const result = await this.eventService.getEventsService(
          req.__.bind(req),
          page,
          limit
        );

        return res.status(result.status_code).json(result);
      },
      res,
      req,
      "getEventsController"
    );
  };

  getEventInfoController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    tryCatchController(async () => {}, res, req, "getEventInfoController");
  };
}
