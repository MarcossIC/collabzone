import { useSetAtom } from 'jotai';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { modalAtom } from '@/store/modalAtom';
import { UserCreateForm } from './UserCreateForm';
import { ModalCrossHeader } from '../ModalCrossHeader/ModalCrossHeader';
const MODAL_ID = 'userCreate';

export const UserCreateModal = () => {
  const setModal = useSetAtom(modalAtom);
  const handleClose = () => {
    setModal(val => ({ ...val, modalId: val.prevModal, prevModal: MODAL_ID }));
  };
  return (
    <ModalWrapper
      id={MODAL_ID}
      className="max-h-[550px] w-full max-w-96 overflow-hidden">
      <div className="relative flex h-[500px] max-h-[500px] flex-col overflow-y-auto overflow-x-hidden p-4 pt-0">
        <ModalCrossHeader title="Invitar Usuario" close={handleClose} />

        <p className="text-base font-normal text-neutral-900">
          Ingresa el email del usuario para invitarlo a unirse a tu equipo.
        </p>
        <UserCreateForm close={handleClose} />
      </div>
    </ModalWrapper>
  );
};
