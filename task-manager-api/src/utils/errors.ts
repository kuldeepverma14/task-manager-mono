import { StatusCodes } from 'http-status-codes';

export interface AppError extends Error {
  statusCode: number;
}

export const createAppError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

export const BadRequestError = (message: string) => createAppError(message, StatusCodes.BAD_REQUEST);
export const UnauthorizedError = (message: string) => createAppError(message, StatusCodes.UNAUTHORIZED);
export const NotFoundError = (message: string) => createAppError(message, StatusCodes.NOT_FOUND);
export const ForbiddenError = (message: string) => createAppError(message, StatusCodes.FORBIDDEN);
