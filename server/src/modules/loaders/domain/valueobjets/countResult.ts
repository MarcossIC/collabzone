import { UUID } from 'crypto';

export interface CountResult {
  id: UUID;
  count: number;
}
