import { signupEnterpriseSchema } from '@/utils/schemas/userSchemas';
import { apiService } from '../api/axios';
import { validateSchema } from './validateSchema';

export const enterpriseSignup = async form => {
  const [schemaErrors, data] = validateSchema(signupEnterpriseSchema, {
    password: form.get('password'),
    email: form.get('email'),
    name: form.get('name'),
    domain: form.get('domain'),
  });
  if (schemaErrors) return schemaErrors;

  const [error, success] = await apiService.post('/emp/register', data);

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
    data: success,
  };
};
