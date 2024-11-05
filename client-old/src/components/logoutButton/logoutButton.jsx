import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
