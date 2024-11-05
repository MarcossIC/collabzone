import { apiService } from '@/utils/api/axios';
import { validateSchema } from '@/utils/functions/validateSchema';
import { inviteSchema } from '@/utils/schemas/userSchemas';

export const inviteUser = async formData => {
  const [error, data] = validateSchema(inviteSchema, {
    email: formData.get('email'),
    role: formData.get('role'),
  });
  if (error) return error;

  const [errorApi, success] = await apiService.put('/admin/associate', data);
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
