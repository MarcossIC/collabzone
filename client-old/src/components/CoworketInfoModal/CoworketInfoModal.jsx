import { modalAtom } from '@/store/modalAtom';
import { EventBus } from '@/utils/phaser/EventBus';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useEffect } from 'react';
import ModalWrapper from '../ModalWrapper/ModalWrapper';

export const CoworketInfoModal = () => {
  const [_, setModalAtom] = useAtom(modalAtom);
  const [coworkerInfo, setCoworkerInfo] = useState({});
  useEffect(() => {
    const onPlayerClicked = playerInfo => {
      setModalAtom({ open: playerInfo.open, modalId: 'playerInfo' });
      setCoworkerInfo(playerInfo);
    };
    EventBus.on('playerCLICKED', onPlayerClicked);
    return () => {
      EventBus.off('playerCLICKED');
    };
  }, []);

  return (
    <ModalWrapper>
      <div className="flex w-full flex-col">
        <div className="w-full text-left font-semibold">
          ID: {coworkerInfo.playerId || ''}
        </div>
      </div>
    </ModalWrapper>
  );
};
