import { useRef } from 'react';
import useSWR from 'swr';
import { getData } from '../../data/getData';
import { defaultConfig } from '@/utils/api/swrConfig';
import { useAtom } from 'jotai';
import { roomAtom } from '@/store/roomsAtom';
import { useEffect } from 'react';

export const useGetRoomList = () => {
  //TODO: Cambiar por el path que trae todas las salas de una empresa
  const swrKeYRef = useRef('/rooms/roomsByEmpId');
  const [rooms, setRooms] = useAtom(roomAtom);

  const { data, mutate, isLoading, isValidating } = useSWR(
    swrKeYRef.current,
    key => getData(key),
    defaultConfig
  );

  const refetch = (data = undefined) => {
    mutate(data, {
      revalidate: true,
      optimisticData: data,
    });
  };
  useEffect(() => {
    if (rooms !== null) {
      refetch([...data, rooms]);
      setRooms(null);
    }
  }, [rooms]);

  return {
    data: data ? data : [],
    isLoading: isLoading || isValidating,
    isValidating,
    refetch,
  };
};
