import { modalAtom } from '@/store/modalAtom';
import { ModalCrossHeader } from '../ModalCrossHeader/ModalCrossHeader';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { useSetAtom } from 'jotai';
import { CreateRoleForm } from '../CreateRoleForm/CreateRoleForm';

const MODAL_ID = 'CreateRole';

export const CreateRoleModal = () => {
  const setModal = useSetAtom(modalAtom);
  const handleClose = () => {
    setModal(val => ({ ...val, modalId: val.prevModal, prevModal: MODAL_ID }));
  };
  return (
    <ModalWrapper
      className="max-h-[550px] w-full max-w-96 overflow-hidden"
      id={MODAL_ID}>
      <div className="relative flex h-[500px] max-h-[500px] w-full flex-col overflow-y-auto overflow-x-hidden p-4 pt-0">
        <ModalCrossHeader title="Crear role" close={handleClose} />
        <CreateRoleForm close={handleClose} />
      </div>
    </ModalWrapper>
  );
};
