import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

interface JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, Buffer.from(process.env.JWT_SECRET, 'utf-8')) as JwtPayload;
    const user = await db('users').where('id', decoded.userId).first();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 