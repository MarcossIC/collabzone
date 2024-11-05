import { getCurrentUserAtom, isEnterpriseUser } from '@/data/getCurrentUser';
import Button from '../Button/Button';
import { ModalTitleWrapper } from '../ModalWrapper/ModalTitleWrapper';
import { UserModalTabs } from './UserModalTabs';
import users from '/public/svg/icon-toolbar/profile-2user.svg';
import { UserCreateModal } from '../UserCreateModal/UserCreateModal';
import { modalAtom } from '@/store/modalAtom';
import { roomAtom } from '@/store/roomsAtom';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useGetUserList } from '@/data/useGetUserList';
import { CreateRoleModal } from '../CreateRoleModal/CreateRoleModal';

const usersList = [
  {
    name: 'Marcos',
    sub: 'Desarrollador',
  },
  {
    name: 'Marcos',
    sub: 'Desarrollador',
  },
];
const MODAL_ID = 'UsersList';

export const UsersModal = () => {
  const user = getCurrentUserAtom();
  const isUserCompany = isEnterpriseUser(user);
  const [modal, setModal] = useAtom(modalAtom);
  const { data, refetch } = useGetUserList();
  const openInviteUser = () => {
    if (!isUserCompany) return;
    setModal(val => ({ ...val, modalId: 'userCreate', prevModal: MODAL_ID }));
  };
  const openCreateRole = () => {
    if (!isUserCompany) return;
    setModal(val => ({ ...val, modalId: 'CreateRole', prevModal: MODAL_ID }));
  };
  useEffect(() => {
    if (modal.open && modal.modalId === MODAL_ID) {
      refetch();
    }
  }, [modal]);
  return (
    <>
      <ModalTitleWrapper
        imgStyle="invert brightness-0"
        className="max-h-[512px] w-full max-w-96"
        id={MODAL_ID}
        icon={users}
        title={`Usuarios (${data.length})`}>
        <div className="flex size-full flex-col gap-y-4 rounded-b-4xl bg-accent-100">
          <UserModalTabs users={data} />
          {isUserCompany && (
            <div className="mt-auto flex w-full items-center justify-between gap-x-3 px-4 pb-8">
              <Button size="full" variant="accent-outline" onClick={openCreateRole}>
                Crear role
              </Button>
              <Button
                className="text-accent-100"
                size="full"
                onClick={openInviteUser}>
                Invitar al equipo
              </Button>
            </div>
          )}
        </div>
      </ModalTitleWrapper>
      <UserCreateModal />
      <CreateRoleModal />
    </>
  );
};
