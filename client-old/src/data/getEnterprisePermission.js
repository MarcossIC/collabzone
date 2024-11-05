import { apiService } from '@/utils/api/axios';

export const getEnterprisePermission = async () => {
  const [error, data] = await apiService.get('/emp/pview');
  if (error) return [];
  return data;
};
