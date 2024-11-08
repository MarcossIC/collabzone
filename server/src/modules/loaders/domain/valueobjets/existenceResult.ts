import { UUID } from 'crypto';

export interface ExistenceResult {
  id: UUID;
  existence: 0 | 1;
}
