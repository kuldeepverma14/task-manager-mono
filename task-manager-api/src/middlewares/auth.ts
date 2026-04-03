import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';
import { JWT_CONFIG } from '../config/jwt';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw UnauthorizedError('Authorization header missing or invalid format.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as { userId: string };
    (req as any).user = { userId: decoded.userId };
    next();
  } catch (error) {
    if ((error as any).statusCode) {
      return res.status((error as any).statusCode).json({
        status: 'error',
        message: (error as any).message,
      });
    }
    throw UnauthorizedError('Invalid access token.');
  }
};
