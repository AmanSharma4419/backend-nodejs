import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { SignupInput, LoginInput } from '../validations/auth.validation';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: SignupInput = req.body;
      const user = await AuthService.signup(userData);
      res.status(201).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: LoginInput = req.body;
      const user = await AuthService.login(credentials);
      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }
} 