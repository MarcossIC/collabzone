import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
    }
  }, [isAuthenticated, user]);

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
      Iniciar sesión
    </button>
  );
};

export default LoginButton;
