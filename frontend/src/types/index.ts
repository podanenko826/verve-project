export const Status = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type Status = typeof Status[keyof typeof Status];

export interface Event {
  id: number;
  userId: string;
  title: string;
  description: string;
  start: Date | string | number;
  end: Date | string | number;
  status: Status;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
