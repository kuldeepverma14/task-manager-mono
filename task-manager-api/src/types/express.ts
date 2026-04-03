import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}
