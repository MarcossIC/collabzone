import { createRole } from '@/data/createRole';
import { FormInput } from '../FormInput/FormInput';
import { FormCheckBox } from '../FormCheckBox/FormCheckBox';
import { useForm } from '@/utils/hooks/useForm';
import Button from '../Button/Button';
import { modalAtom } from '@/store/modalAtom';
import { useAtom } from 'jotai';
const items = [
  { id: '1', label: 'Crear sala' },
  { id: '2', label: 'Invitar usuario' },
  { id: '3', label: 'Crear Actividades' },
  { id: '4', label: 'Crear proyectos' },
  { id: '5', label: 'Editar sala' },
  { id: '6', label: 'Eliminar sala' },
  { id: '7', label: 'Eliminar usuario' },
  { id: '8', label: 'Integrar App' },
];

export const CreateRoleForm = ({ close }) => {
  const [modalA, setModal] = useAtom(modalAtom);
  const handleSuccess = async form => {
    const result = await createRole(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }
    setModal(val => ({ ...val, modalId: val.prevModal, prevModal: modalA.modalId }));
  };

  const { errors, isPending, submit } = useForm(handleSuccess);

  return (
    <form className="mt-5 flex size-full flex-col gap-y-6" onSubmit={submit}>
      <label
        htmlFor="rolField"
        className="flex flex-col gap-y-3 text-base font-medium text-black">
        Rol
        <FormInput
          placeholder="Ingresa el nombre del rol"
          name="permissions"
          type="text"
          id="rolField"
          autoComplete="off"
          password={false}
        />
      </label>
      <FormCheckBox
        title="Permisos"
        sub="¿Qué permisos va a tener este rol?"
        items={items}
      />
      <div className="mt-auto flex items-center justify-end gap-x-4">
        {/*       <Button
          variant="accent-outline"
          type="button"
          className="h-9 px-5"
          onClick={close}>
          Cancelar
        </Button> */}
        <Button
          variant="primary"
          type="submit"
          className="h-9 px-5 text-accent-100"
          disabled={isPending}>
          Invitar usuario
        </Button>
      </div>
    </form>
  );
};
