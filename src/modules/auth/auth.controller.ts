import { Request, Response } from "express";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import {
  RegisterValidator,
  verifyEmailValidator,
} from "./validators/register.validator";
import { AuthService, AuthServiceImpl } from "./service/auth.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthServiceImpl();
  }

  registerController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = RegisterValidator.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.authService.registerUserService(
          value,
          req.__.bind(req)
        );
        res.status(response.status_code).json(response);
      },
      res,
      req,
      "registerController"
    );
  };

  verifyEmailController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = verifyEmailValidator.validate(req.query ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.authService.verifyEmail(
          value,
          req.__.bind(req)
        );

        if (response.status_code === 200) {
          return res.redirect(
            `http://localhost:3000/user/verify-email?status=success`
          );
        } else {
          return res.redirect(
            `http://localhost:3000/user/verify-email?status=failed`
          );
        }
      },
      res,
      req,
      "verifyEmailController"
    );
  };
}
