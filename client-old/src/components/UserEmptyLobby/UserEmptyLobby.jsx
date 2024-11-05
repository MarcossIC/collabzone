import {
  getCurrentUserAtom,
  getUserRole,
  isNormalUser,
} from '@/data/getCurrentUser';
import warning from '/public/svg/Warning.svg';
import { USER_ROLES } from '@/data/roles';
import { useRef } from 'react';
import Button from '../Button/Button';
import { modalAtom } from '@/store/modalAtom';
import { useSetAtom } from 'jotai';

const lobbyMessage = role => {
  if (role === USER_ROLES.ENTERPRISE) {
    return '¡Bienvenido! Comienza a crear tus propias salas de trabajo y gestionar tu equipo. Invita a usuarios a unirse a tu empresa y asígnales roles para que puedan interactuar en las salas que crees.';
  } else if (role === USER_ROLES.USER) {
    return 'Aún no perteneces a ningún equipo de trabajo. ¡Espera a que te inviten a un equipo para poder visualizar sus salas e interactuar con tus compañeros!';
  }
  return 'Comienza a colaborar con tus compañeros uniéndote a una sala.';
};

const LobbyButton = ({ role }) => {
  const buttonRef = useRef();
  const setModal = useSetAtom(modalAtom);
  if (role === USER_ROLES.COWORKER) {
    const openRooms = () => {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const value = 'Salas';
      setModal(val => ({
        open: !val.open,
        modalId: value,
        coords: [btnRect.bottom * -1 + 55, btnRect.left + 95],
        position: 'bottom',
        firstOpen: true,
      }));
    };
    return (
      <Button
        ref={buttonRef}
        variant="primary"
        size="full"
        onClick={openRooms}
        className="mx-auto max-w-72 text-accent-100">
        Unirse a Sala
      </Button>
    );
  }

  if (role === USER_ROLES.ENTERPRISE) {
    const openRooms = () => {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const value = 'userCreate';
      setModal(val => ({
        open: !val.open,
        modalId: value,
        coords: [btnRect.bottom * -1 + 55, btnRect.left + 95],
        position: 'bottom',
        firstOpen: true,
      }));
    };
    return (
      <Button
        ref={buttonRef}
        variant="primary"
        size="full"
        onClick={openRooms}
        className="mx-auto max-w-72 text-accent-100">
        Invita un usuario
      </Button>
    );
  }
  return null;
};

export const UserEmptyLobby = () => {
  const user = getCurrentUserAtom();
  const userRole = getUserRole(user);
  return (
    <div className="mr-auto flex w-full max-w-[50rem] flex-col rounded-2xl border border-accent-1000 px-4 py-3">
      <div className="flex items-start justify-center gap-x-2 pb-12">
        <img src={warning} width={24} height={24} alt="Warning icon" />
        <p className="-mt-1 text-base font-semibold">{lobbyMessage(userRole)}</p>
      </div>
      <LobbyButton role={userRole} />
    </div>
  );
};
