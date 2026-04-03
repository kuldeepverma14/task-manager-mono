import prisma from '../db/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { createTaskSchema, updateTaskSchema, getTasksQuerySchema } from '../validations/task';
import { Status } from '../types/enums';

export const getAllTasks = async (userId: string, query: any) => {
  const validatedQuery = getTasksQuerySchema.parse(query);
  const { page, limit, status, search } = validatedQuery;

  const skip = (page - 1) * limit;

  const where: any = {
    userId,
    AND: [
      status ? { status } : {},
      search ? { title: { contains: search, mode: 'insensitive' } } : {},
    ],
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const createTask = async (userId: string, data: any) => {
  const validated = createTaskSchema.parse(data);

  return await prisma.task.create({
    data: {
      ...validated,
      userId,
    },
  });
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) throw NotFoundError('Task not found.');
  if (task.userId !== userId) throw ForbiddenError('Access denied.');

  return task;
};

export const updateTask = async (userId: string, taskId: string, data: any) => {
  const validated = updateTaskSchema.parse(data);
  const task = await getTaskById(userId, taskId);

  return await prisma.task.update({
    where: { id: taskId },
    data: validated,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId);

  await prisma.task.delete({ where: { id: taskId } });
};

export const toggleTaskStatus = async (userId: string, taskId: string) => {
  const task = await getTaskById(userId, taskId);

  const newStatus = task.status === Status.COMPLETED ? Status.PENDING : Status.COMPLETED;

  return await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};
