import { useAtom, useSetAtom } from 'jotai';
import Button from '../Button/Button';
import { CreateRoomModal } from '../CreateRoomModal/CreateRoomModal';
import { ModalTitleWrapper } from '../ModalWrapper/ModalTitleWrapper';
import { RoomModalTabs } from './RoomModalTabs';
import container from '/public/svg/container.svg';
import { modalAtom } from '@/store/modalAtom';
import { getCurrentUserAtom, isEnterpriseUser } from '@/data/getCurrentUser';
import { useEffect } from 'react';
import { useGetRoomList } from '@/utils/hooks/useGetRoomList';

const roomsData = [
  { name: 'Desarrollo', count: 4 },
  { name: 'Diseño', count: 2 },
  { name: 'General', count: 0 },
  { name: 'Daily', count: 0 },
  { name: 'Descanso', count: 0 },
];
const MODAL_ID = 'Salas';
export const RoomModal = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const user = getCurrentUserAtom();
  const isUserCompany = isEnterpriseUser(user);
  const { data, refetch, isLoading } = useGetRoomList();
  const openCreate = () => {
    if (!isUserCompany) return;
    setModal(val => ({ ...val, modalId: 'createRoom', prevModal: MODAL_ID }));
  };
  useEffect(() => {
    if (modal.open && modal.modalId === MODAL_ID) {
      refetch();
    }
  }, [modal]);
  return (
    <>
      <ModalTitleWrapper
        className="max-h-[512px] w-full max-w-96"
        id={MODAL_ID}
        icon={container}
        title={`Salas (${data?.length})`}>
        <div className="flex size-full flex-col gap-y-4 rounded-b-4xl bg-accent-100">
          <RoomModalTabs rooms={data} isLoading={isLoading && data.length === 0} />
          {isUserCompany && (
            <div className="mt-auto flex w-full items-center justify-center pb-8">
              <Button
                className="max-w-[75%] text-accent-100"
                size="full"
                onClick={openCreate}>
                Crear Sala
              </Button>
            </div>
          )}
        </div>
      </ModalTitleWrapper>
      <CreateRoomModal />
    </>
  );
};
