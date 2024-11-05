import FormField from '../FormField/FormField';
import PasswordFormField from '../PasswordField/PasswordField';

// TODO: Implementar logica para, utilizar textarea y dropdowns
export default function RenderFields({ field, error }) {
  const commonProps = {
    id: field.id,
    'data-testid': field.id,
    name: field.name,
    label: field.label,
    defaultValue: field.defaultValue || '',
    autoComplete: field.autoComplete || 'off',
    error: error,
    icon: field.icon,
    tabIndex: field.tabindex,
    placeholder: field.placeholder,
    iconColor: field.iconColor,
  };
  if (field.type === 'password') {
    return <PasswordFormField {...commonProps} />;
  }
  return <FormField {...commonProps} type={field.type} />;
}
