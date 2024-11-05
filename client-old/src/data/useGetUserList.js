import { useRef } from 'react';
import useSWR from 'swr';
import { getData } from './getData';
import { defaultConfig } from '@/utils/api/swrConfig';

const mapUserList = data => {
  return data.map(item => {
    return {
      id: item.id,
      name: item.username || 'No-name',
      picture: item.profilePicture || '',
      status: item.status,
      roomId: item?.roomId || '',
      sub: item?.roomName ? `En la sala ${item?.roomName || ''}` : 'Offline',
    };
  });
};

export const useGetUserList = () => {
  //TODO: Cambiar key por el path correcta para la lista de usuarios de la empresa
  const swrKeYRef = useRef('emp/viewusers');

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    key => getData(key),
    defaultConfig
  );

  const refetch = () => {
    mutate(undefined, {
      revalidate: true,
      optimisticData: data,
    });
  };

  return {
    data: data?.users ? mapUserList(data.users) : [],
    isLoading: isLoading || isValidating,
    refetch,
  };
};
