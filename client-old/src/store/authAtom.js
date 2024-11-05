import { useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const KEY = 'AUTH';
const initialAuth = {
  isAuth: false,
  user: null,
};
const start = key => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : initialAuth;
};

export const authAtom = atomWithStorage(KEY, start(KEY), {
  setItem: (key, newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  getItem: (key, initialValue) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  },
  removeItem: key => {
    localStorage.removeItem(key);
  },
});

export const useLogout = () => {
  const setAuth = useSetAtom(authAtom);
  const handleLogout = () => {
    setAuth({
      isAuth: false,
      user: null,
    });
  };
  return handleLogout;
};
