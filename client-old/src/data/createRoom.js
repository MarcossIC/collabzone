/* eslint-disable react-hooks/rules-of-hooks */
import { modalAtom } from '@/store/modalAtom';
import { roomAtom } from '@/store/roomsAtom';
import { apiService } from '@/utils/api/axios';
import { validateSchema } from '@/utils/functions/validateSchema';
import { roomSchema } from '@/utils/schemas/roomSchemas';
import { useAtom, useSetAtom } from 'jotai';

export const createRoom = async formData => {
  const [error, data] = validateSchema(roomSchema, {
    name: formData.get('roomName'),
    tileset: formData.get('roomPreset'),
  });
  if (error) {
    console.error('errorSchema', error);
    return error;
  }
  const [errorApi, success] = await apiService.post('/rooms/create', data);
  if (errorApi) {
    console.error('errorApi', errorApi);
    return;
  }

  return {
    id: crypto.randomUUID(),
    status: 'SUCCESS',
    data: success,
  };
};
