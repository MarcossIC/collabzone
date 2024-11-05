import { EntitySchemaColumnOptions } from 'typeorm';

const columnDateType =
  process.env.NODE_ENV === 'automated_tests' ? 'date' : 'timestamp';

export const baseColumnSchemas: { [key: string]: EntitySchemaColumnOptions } = {
  id: {
    name: 'id',
    type: 'integer',
    primary: true,
    generated: true,
  },
  createdAt: {
    name: 'created_at',
    type: columnDateType,
    createDate: true,
    nullable: false,
  },
  updatedAt: {
    name: 'updated_at',
    type: columnDateType,
    updateDate: true,
    nullable: false,
  },
  isDeleted: {
    name: 'is_deleted',
    type: 'boolean',
    default: false,
  },
};
