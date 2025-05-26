import { Request, Response } from "express";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import {
  RegisterValidator,
  verifyEmailValidator,
} from "./validators/register.validator";
import { AuthService, AuthServiceImpl } from "./service/auth.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import dotenv from "dotenv";
import {
  changePasswordValidate,
  forgotPasswordValidate,
  resetPasswordValidate,
} from "./validators/password.validate";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";
import { LoginValidator } from "./validators/login.validate";
import { tokenSchema } from "../token/token.validate";
import { JwtService, JwtServiceImpl } from "../token/token.service";

dotenv.config();

export class AuthController {
  private readonly authService: AuthService;
  private readonly jwtService: JwtService;

  constructor() {
    this.authService = new AuthServiceImpl();
    this.jwtService = new JwtServiceImpl();
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

        const response = await this.authService.verifyEmailService(
          value,
          req.__.bind(req)
        );

        if (response.status_code === 200) {
          return res.redirect(
            `${process.env.CLIENT_URL}/user/verify-email?status=success`
          );
        } else {
          return res.redirect(
            `${process.env.CLIENT_URL}/user/verify-email?status=failed`
          );
        }
      },
      res,
      req,
      "verifyEmailController"
    );
  };

  loginController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = LoginValidator.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.authService.loginUserService(
          value,
          req.__.bind(req)
        );

        const { data } = response;

        if (data) {
          console.log(data);
          const { token } = data;
          if (token) {
            const { refresh_token } = token;
            res.cookie("refresh_token", refresh_token, {
              httpOnly: true,
              secure: false,
              sameSite: "strict",
              path: "/",
            });
          }
        }

        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "loginController"
    );
  };

  changePasswordMeController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.params.id;
        const { error, value } = changePasswordValidate.validate(
          req.body ?? {}
        );

        if (!isValidObjectId(userId)) {
          return errorRes(
            res,
            req.__("INVALID_BRAND_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.authService.changePasswordMeService(
          userId,
          value,
          req.__.bind(req)
        );

        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "changePasswordMeController"
    );
  };

  forgotPasswordController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = forgotPasswordValidate.validate(
          req.body ?? {}
        );

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.authService.forgotPasswordService(
          value,
          req.__.bind(req)
        );

        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "forgotPasswordController"
    );
  };

  resetPasswordController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = resetPasswordValidate.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.authService.resetPasswordService(
          value,
          req.__.bind(req)
        );

        if (response.status_code === 200) {
          res.redirect(
            `${process.env.CLIENT_URL}/user/reset-password?status=success`
          );
        } else {
          res.redirect(
            `${process.env.CLIENT_URL}/user/reset-password?status=failed`
          );
        }
      },
      res,
      req,
      "resetPasswordController"
    );
  };

  refreshTokenController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = tokenSchema.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.jwtService.refreshTokenService(
          value,
          req.__.bind(req)
        );

        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "refreshTokenController"
    );
  };

  logoutController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const response = await this.authService.logoutService(
          req,
          req.__.bind(req)
        );
        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "logoutController"
    );
  };
}
