import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as taskService from '../services/taskService';

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await taskService.getAllTasks(userId, req.query);
  res.status(StatusCodes.OK).json({ status: 'success', data: result });
};

export const create = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const task = await taskService.createTask(userId, req.body);
  res.status(StatusCodes.CREATED).json({ status: 'success', data: { task } });
};

export const getOne = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const task = await taskService.getTaskById(userId, id as string);
  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

export const update = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const task = await taskService.updateTask(userId, id as string, req.body);
  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

export const remove = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  await taskService.deleteTask(userId, id as string);
  res.status(StatusCodes.OK).json({ status: 'success', message: 'Task deleted successfully.' });
};

export const toggle = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const task = await taskService.toggleTaskStatus(userId, id as string);
  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

