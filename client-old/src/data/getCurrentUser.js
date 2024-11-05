/* eslint-disable react-hooks/rules-of-hooks */
import { authAtom } from '@/store/authAtom';
import { useAtomValue } from 'jotai';
import { USER_ROLES } from './roles';

export const getCurrentUser = () => {
  const value = localStorage.getItem('AUTH');
  const parsedValue = value ? JSON.parse(value) : null;
  return parsedValue?.user;
};
export const isNormalUserWithoutCompany = user => {
  return user && !user.isEmp && !user?.id_emp;
};
export const isNormalUser = user => {
  return user && !user.isEmp && !!user?.id_emp && user?.id_emp !== '';
};

export const isEnterpriseUser = user => {
  return user && user.isEmp;
};

export const getUserRole = user => {
  if (isEnterpriseUser(user)) {
    return USER_ROLES.ENTERPRISE;
  } else if (isNormalUser(user)) {
    return USER_ROLES.COWORKER;
  }
  return USER_ROLES.USER;
};

export const getUserProfile = () => {
  const value = localStorage.getItem('AUTH');
  const parsedValue = value ? JSON.parse(value) : null;
  const user = parsedValue?.user;
  return user ? user.profilePicture : '';
};

export const getUserAtomProfile = () => {
  const auth = useAtomValue(authAtom);
  const user = auth?.user;
  return user ? user.profilePicture : '';
};

export const getCurrentUserAtom = () => {
  const auth = useAtomValue(authAtom);
  return auth?.user;
};
