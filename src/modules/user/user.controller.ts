import { Request, Response } from "express";
import { IUserService, UserServiceImpl } from "./user.service";
import { userActiveValidate, userInfoValidate } from "./user.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";

export class UserController {
  private readonly userService: IUserService;

  constructor() {
    this.userService = new UserServiceImpl();
  }

  updateUserController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;

        const { error, value } = userInfoValidate.validate(req.body);

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.userService.updateUserInfoService(
          userId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateUserController"
    );
  };

  getUserProfileController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;

        const response = await this.userService.getProfileService(
          userId,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getUserProfileController"
    );
  };

  updateActiveController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;

        const { error, value } = userActiveValidate.validate(req.body);

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.userService.updateActiveUserService(
          userId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getUserProfileController"
    );
  };

  createAndUpdateAvatarController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;
        const file = req.file as Express.Multer.File | undefined;

        if (!file) {
          res.status(400).send("No file uploaded.");
          return;
        }

        const response =
          await this.userService.createAndUpdateAvatarUserService(
            userId,
            file,
            req.__.bind(req)
          );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createAndUpdateAvatarController"
    );
  };

  deleteAvatarController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;

        const response = await this.userService.deleteAvatarUserService(
          userId,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createAndUpdateAvatarController"
    );
  };
}
