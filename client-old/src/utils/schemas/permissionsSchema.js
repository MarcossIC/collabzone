import { z } from 'zod';

export const permissionsSchema = z.object({
  permissions: z.string(),
});
