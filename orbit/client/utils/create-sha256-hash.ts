import { createHash } from 'crypto';

export const createSHA256Hash = (payload: string): string => createHash('sha256').update(payload).digest('base64');
