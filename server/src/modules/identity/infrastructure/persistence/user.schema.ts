import { User } from '@/modules/identity/domain/models/user.domain';
import { EntitySchema } from 'typeorm';
import { baseColumnSchemas } from '../../../../common/infrastructure/persistence/base.schema';
import { CredentialsEmbeddableSchema } from './credential.embeddable.schema';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  target: User,
  columns: {
    ...baseColumnSchemas,
    name: {
      name: 'name',
      type: 'varchar',
      nullable: false,
      length: 80,
    },
    email: {
      name: 'email',
      type: 'varchar',
      nullable: false,
      length: 128,
      unique: true,
    },
    password: {
      name: 'password',
      type: 'varchar',
      nullable: true,
      length: 60,
    },
    confirmed: {
      name: 'confirmed',
      type: 'boolean',
      nullable: false,
      default: false,
    },
  },
  embeddeds: {
    credentials: {
      prefix: 'creds',
      schema: CredentialsEmbeddableSchema,
    },
  },
  uniques: [
    {
      name: 'UNIQUE_EMAIL',
      columns: ['email'],
    },
  ],
  relations: {
    providers: {
      type: 'one-to-many',
      target: 'AuthProvider',
      inverseSide: 'user',
      cascade: true,
    },
  },
});
