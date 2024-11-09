import { Repository } from 'typeorm';

import { Base } from '@/common/domain/models/base.domain';

export class MockRepository<T> {
  save = vi.fn();
  findOne = vi.fn();
  find = vi.fn();
  delete = vi.fn();
}

export const mockRepository = {
  save: vi.fn(),
  findOne: vi.fn(),
  find: vi.fn(),
  delete: vi.fn(),
} as unknown as Repository<Base>;
