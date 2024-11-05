import ButtonBox from '@/components/ButtonBox/ButtonBox';
import FormComponent from '@/components/FormComponent/FormComponent';
import AuthLayout from '@/layouts/AuthLayout';
import { authAtom } from '@/store/authAtom';
import { enterpriseSignup } from '@/utils/functions/enterpriseSignup';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const enterpriseSignupFields = [
  {
    label: 'Correo electronico Empresarial',
    type: 'email',
    tabindex: 1,
    id: 'emailField',
    name: 'email',
    icon: '/images/sms.png',
    placeholder: 'Ingresa tu Correo',
    iconColor: 'secondary',
    autoComplete: 'email',
  },
  {
    label: 'Nombre de la empresa',
    type: 'text',
    tabindex: 2,
    id: 'nameField',
    name: 'name',
    icon: '/images/user-square.png',
    placeholder: 'Ingresa el nombre',
    iconColor: 'secondary',
  },
  {
    label: 'Ingrese el dominio',
    type: 'text',
    tabindex: 3,
    id: 'domainField',
    name: 'domain',
    icon: '/images/user-square.png',
    placeholder: 'Ingresa el dominio',
    iconColor: 'secondary',
  },
  {
    label: 'Contraseña',
    type: 'password',
    tabindex: 4,
    id: 'passwordField',
    name: 'password',
    icon: '/svg/key.svg',
    placeholder: 'Ingresa tu Contraseña',
    iconColor: 'accent',
    autoComplete: 'password',
  },
];

export const EnterpriseSignup = () => {
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);
  const handleSuccess = async form => {
    const result = await enterpriseSignup(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }

    setAuth({ isAuth: true, user: result.data });
    navigate('/office');
  };

  return (
    <AuthLayout
      h1="Pagina para registrar una empresa"
      h2="Hola Bienvenido a Escape Co"
      h1Hide>
      <div className="flex w-full flex-col items-center justify-center">
        <FormComponent
          id="enterprise-signup"
          btnText="Entrar"
          fields={enterpriseSignupFields}
          onSubmit={handleSuccess}
        />
        <ButtonBox boxText="¿Ya tienes una cuenta?" className="!p-0">
          <Link
            to="/enterprise-signin"
            className="no-outline flex size-full items-center justify-center bg-transparent">
            Iniciar sesion
          </Link>
        </ButtonBox>
      </div>
    </AuthLayout>
  );
};
