import { z } from 'zod';
import { Status } from '../types/enums';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(Status).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(Status).optional(),
});

export const getTasksQuerySchema = z.object({
  page: z.preprocess((val) => (val === '' ? undefined : val), 
    z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1))),
  limit: z.preprocess((val) => (val === '' ? undefined : val), 
    z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10))),
  status: z.preprocess((val) => (val === '' ? undefined : val), 
    z.nativeEnum(Status).optional()),
  search: z.string().optional(),
});
