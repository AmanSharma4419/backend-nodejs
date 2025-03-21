import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from '../utils/errors';

export const validationPipe = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const validationErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      next(new ValidationError(JSON.stringify(validationErrors)));
    } else {
      req.body = dtoInstance;
      next();
    }
  };
}; 