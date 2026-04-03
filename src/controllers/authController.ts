import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as authService from '../services/authService';
import { BadRequestError } from '../utils/errors';

export const register = async (req: Request, res: Response) => {
  await authService.registerUser(req.body);
  const result = await authService.loginUser({
    email: req.body.email,
    password: req.body.password
  });
  res.status(StatusCodes.CREATED).json({ status: 'success', data: result });
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  res.status(StatusCodes.OK).json({ status: 'success', data: result });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw BadRequestError('Refresh token required.');

  const tokens = await authService.refreshUserToken(refreshToken);
  res.status(StatusCodes.OK).json({ status: 'success', data: tokens });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const userId = (req as any).user?.userId;

  if (refreshToken && userId) {
     await authService.logoutUser(refreshToken, userId);
  }

  res.status(StatusCodes.OK).json({ status: 'success', message: 'Logged out successfully.' });
};
