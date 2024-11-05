import FormComponent from '@/components/FormComponent/FormComponent';
import AuthLayout from '@/layouts/AuthLayout';
import { userWelcomeSubmit } from '@/utils/functions/userWelcomeSubmit';
import { useNavigate } from 'react-router-dom';

const welcomeFields = [
  {
    label: 'Nombre',
    type: 'text',
    tabindex: 1,
    id: 'nameField',
    name: 'name',
    icon: '/images/user-square.png',
    placeholder: 'Ingresa tu Nombre',
    iconColor: 'primary',
    autoComplete: 'given-name',
  },
  {
    label: 'Apellido',
    type: 'text',
    tabindex: 2,
    id: 'lastnameField',
    name: 'lastname',
    icon: '/images/user-square.png',
    placeholder: 'Ingresa tu apellido',
    iconColor: 'secondary',
    autoComplete: 'family-name',
  },
  {
    label: 'Nombre de usuario',
    type: 'text',
    tabindex: 3,
    id: 'usernameField',
    name: 'username',
    icon: '/images/user-square.png',
    placeholder: 'Ingresa tu nombre de usuario',
    iconColor: 'primary',
    autoComplete: 'family-name',
  },
  {
    label: 'Rol',
    type: 'text',
    tabindex: 4,
    id: 'roleField',
    name: 'role',
    icon: '/svg/Dev.svg',
    placeholder: 'Ingresa tu Rol',
    iconColor: 'accent',
  },
];

export const UserWelcomePage = () => {
  const navigate = useNavigate();
  const handleSuccess = async form => {
    const result = await userWelcomeSubmit(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }
    navigate('/office');
  };
  return (
    <AuthLayout
      h1="Ingra tus datos de perfil"
      h2="Hola Bienvenido a Escape Co"
      h1Hide>
      <FormComponent
        id="welcome-profile"
        btnText="Continuar"
        fields={welcomeFields}
        onSubmit={handleSuccess}
      />
    </AuthLayout>
  );
};
