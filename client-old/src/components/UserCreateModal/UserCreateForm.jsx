import { useForm } from '@/utils/hooks/useForm';
import Button from '../Button/Button';
import { FormInput } from '../FormInput/FormInput';
import { FormDropdown } from '../FormDropdown/FormDropdown';
import { inviteUser } from '@/data/inviteUser';
import { getEnterprisePermission } from '../../data/getEnterprisePermission';
import { useState, useEffect } from 'react';
import { modalAtom } from '@/store/modalAtom';
import { useAtom } from 'jotai';

export const UserCreateForm = ({ close }) => {
  const [modalA, setModal] = useAtom(modalAtom);
  const handleSuccess = async form => {
    const result = await inviteUser(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }
    setModal(val => ({ ...val, modalId: val.prevModal, prevModal: modalA.modalId }));
  };

  const { errors, isPending, submit } = useForm(handleSuccess);
  const [roleDropdown, setDropdown] = useState([]);

  const handleCreateRole = () => {
    setModal(val => ({ ...val, modalId: 'CreateRole', prevModal: modalA.modalId }));
  };

  useEffect(() => {
    getEnterprisePermission().then(data => {
      setDropdown(data.map(item => ({ placeholder: item, value: item })));
    });
  }, []);

  return (
    <form className="mt-5 flex h-full flex-col gap-y-6" onSubmit={submit}>
      <label
        htmlFor="userEmailField"
        className="flex flex-col gap-y-3 text-base font-medium text-black">
        Correo Electronico
        <FormInput
          placeholder="Correo Electronico"
          name="email"
          type="email"
          id="userEmailField"
          autoComplete="off"
          password={false}
        />
      </label>
      <FormDropdown
        placeholder="Elige los roles que tendrá"
        items={roleDropdown}
        dropdownAction={handleCreateRole}
      />
      <div className="mt-auto flex items-center justify-end gap-x-4">
        <Button
          variant="accent-outline"
          type="button"
          className="h-9 px-5"
          onClick={close}>
          Cancelar
        </Button>
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
