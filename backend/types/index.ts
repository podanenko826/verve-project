export const Status = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type Status = typeof Status[keyof typeof Status];
