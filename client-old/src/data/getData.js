import { apiService } from '@/utils/api/axios';

export const getData = async key => {
  const [error, data] = await apiService.get(key);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};
