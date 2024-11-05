import { z } from 'zod';

export const roomSchema = z.object({
  name: z.string(),
  tileset: z.string(),
});
