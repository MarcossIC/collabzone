import { useSetAtom } from 'jotai';
import Button from '../Button/Button';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { CreateRoomForm } from './CreateRoomForm';
import { modalAtom } from '@/store/modalAtom';
import crossicon from '/public/svg/crossIcon.svg';

export const CreateRoomModal = () => {
  const setModal = useSetAtom(modalAtom);
  const handleClose = () => {
    setModal(val => ({ ...val, modalId: 'Salas' }));
  };
  return (
    <ModalWrapper
      id="createRoom"
      className="max-h-[550px] w-full max-w-96 overflow-hidden">
      <div className="relative flex h-[500px] max-h-[500px] flex-col overflow-y-auto overflow-x-hidden p-4 pt-0">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium leading-7 text-accent-1000">
            Crear Sala
          </h3>
          <Button
            variant="transparent"
            size="fit"
            className="p-0 text-accent-1000"
            onClick={handleClose}>
            <img
              src={crossicon}
              width={24}
              height={24}
              className="aspect-square"
              decoding="async"
            />
          </Button>
        </div>
        <p className="text-base font-normal text-neutral-900">
          Crea una sala y adáptala a las necesidades de tu equipo.
        </p>
        <CreateRoomForm close={handleClose} />
      </div>
    </ModalWrapper>
  );
};
