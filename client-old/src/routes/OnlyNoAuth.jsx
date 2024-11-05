import { authAtom } from '@/store/authAtom';
import { useAtomValue } from 'jotai';
import { Navigate } from 'react-router-dom';

export const OnlyNoAuth = ({ children }) => {
  const auth = useAtomValue(authAtom);
  if (auth.isAuth) return <Navigate to="/office" />;

  return children;
};
