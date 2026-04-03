export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
