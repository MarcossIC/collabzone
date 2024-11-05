import { apiService } from '@/utils/api/axios';
import { validateSchema } from '@/utils/functions/validateSchema';
import { permissionsSchema } from '@/utils/schemas/permissionsSchema';

export const createRole = async formData => {
  const [error, data] = validateSchema(permissionsSchema, {
    permissions: formData.get('permissions'),
  });
  if (error) return error;
  const [errorApi, success] = await apiService.post('/emp/createPermissions', data);
  if (errorApi) {
    console.log('errorApi', errorApi);
    return {
      id: crypto.randomUUID(),
      status: 'ERROR',
    };
  }
  return {
    id: crypto.randomUUID(),
    status: 'SUCCESS',
    data: success,
  };
};
