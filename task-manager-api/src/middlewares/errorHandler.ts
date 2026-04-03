import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if ((err as any).statusCode) {
    return res.status((err as any).statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle Prisma unique constraint violations (P2002) accurately
  if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2002') {
     return res.status(StatusCodes.CONFLICT).json({ status: 'error', message: 'User with this email already exists.' });
  }

  console.error('SERVER ERROR:', err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal Server Error. Please try again later.',
  });
};
