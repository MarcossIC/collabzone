import { welcomeSchema } from '@/utils/schemas/userSchemas';
import { apiService } from '../api/axios';
import { welcomeAPIMapper } from './mappers';
import { validateSchema } from './validateSchema';

export const userWelcomeSubmit = async form => {
  const [schemaErrors, data] = validateSchema(welcomeSchema, {
    name: form.get('name'),
    lastname: form.get('lastname'),
    username: form.get('username'),
    role: form.get('role'),
  });
  if (schemaErrors) return schemaErrors;
  const [error, _] = await apiService.put('/user/profile', welcomeAPIMapper(data));

  if (error) {
    return {
      id: crypto.randomUUID(),
      status: 'FETCH_ERROR',
      errors: { GLOBAL: 'Ocurrio un error en el servidor' },
    };
  }
  return {
    id: crypto.randomUUID(),
    status: 'SUCCESS',
  };
};
