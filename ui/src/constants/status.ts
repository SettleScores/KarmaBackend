import type { TaskStatus } from '../api/types';

export const STATUS_LABEL: Record<TaskStatus['status'], string> = {
  Done: 'Completed',
  Working: 'In progress',
  Pending: 'Pending review',
  Rejected: 'Rejected',
  Unknown: 'Not started',
};
