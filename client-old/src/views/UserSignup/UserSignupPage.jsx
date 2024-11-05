import ButtonBox from '@/components/ButtonBox/ButtonBox';
import FormComponent from '@/components/FormComponent/FormComponent';
import AuthLayout from '@/layouts/AuthLayout';
import { signupSubmit } from '@/utils/functions/signupSubmit';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const userSignupFields = [
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
    autoComplete: 'new-password',
    name: 'password',
    icon: '/svg/key.svg',
    placeholder: 'Ingresa tu Contraseña',
    iconColor: 'accent',
  },
];
export const UserSignupPage = () => {
  const navigate = useNavigate();
  const handleSuccess = async form => {
    const result = await signupSubmit(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }
    setAuth({ isAuth: true, user: result.data });
    navigate('/office');
  };

  return (
    <AuthLayout h1="Hola Bienvenido a Escape Co" h2="Registrarse">
      <div className="flex w-full flex-col items-center justify-center">
        <FormComponent
          id="user-signup"
          btnText="Registrarme"
          fields={userSignupFields}
          onSubmit={handleSuccess}
        />
        <ButtonBox boxText="¿Ya tienes una cuenta?" className="!p-0">
          <Link
            to="/signin"
            className="no-outline flex size-full items-center justify-center bg-transparent">
            Iniciar sesion
          </Link>
        </ButtonBox>
      </div>
    </AuthLayout>
  );
};
