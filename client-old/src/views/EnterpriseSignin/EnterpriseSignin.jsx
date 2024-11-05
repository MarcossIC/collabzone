import ButtonBox from '@/components/ButtonBox/ButtonBox';
import FormComponent from '@/components/FormComponent/FormComponent';
import AuthLayout from '@/layouts/AuthLayout';
import { authAtom } from '@/store/authAtom';
import { enterpriseSignin } from '@/utils/functions/enterpriseSignin';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const userSigninFields = [
  {
    label: 'Correo electronico',
    type: 'email',
    tabindex: 1,
    id: 'nameField',
    name: 'email',
    icon: '/images/sms.png',
    placeholder: 'Ingresa tu Correo',
    iconColor: 'secondary',
    autoComplete: 'email',
  },
  {
    label: 'Contraseña',
    type: 'password',
    tabindex: 2,
    id: 'passwordField',
    name: 'password',
    icon: '/svg/key.svg',
    placeholder: 'Ingresa tu Contraseña',
    iconColor: 'accent',
    autoComplete: 'password',
  },
];

export const EnterpriseSignin = () => {
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);
  const handleSuccess = async form => {
    const result = await enterpriseSignin(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }
    setAuth({ isAuth: true, user: result.data });
    navigate('/office');
  };

  return (
    <AuthLayout h1="Hola Bienvenido a Escape Co" h2="Login">
      <div className="flex w-full flex-col items-center justify-center">
        <FormComponent
          id="enterprise-signin"
          btnText="Entrar"
          fields={userSigninFields}
          onSubmit={handleSuccess}
        />
        <ButtonBox boxText="¿Todabia no tienes cuenta?" className="!p-0">
          <Link
            to="/enterprise-signup"
            className="no-outline flex size-full items-center justify-center bg-transparent">
            Registrate
          </Link>
        </ButtonBox>
      </div>
    </AuthLayout>
  );
};
