import Button from '../Button/Button';
import { FormInput } from '../FormInput/FormInput';
import { PresetRadioItem } from './PresetRadioItem';
import { useForm } from '@/utils/hooks/useForm';
import { createRoom } from '@/data/createRoom';
import { roomAtom } from '@/store/roomsAtom';
import { modalAtom } from '@/store/modalAtom';
import { useAtom, useSetAtom } from 'jotai';

export const CreateRoomForm = ({ close }) => {
  const setRoom = useSetAtom(roomAtom);
  const [modalA, setModal] = useAtom(modalAtom);
  const handleSuccess = async form => {
    const result = await createRoom(form);
    if (!result || result.status !== 'SUCCESS') {
      return result;
    }
    setRoom({
      id: result.data.id,
      name: result.data.name,
      isActive: result.data.users.length > 0,
      permissions: result.data.permissions,
    });
    setModal(val => ({ ...val, modalId: val.prevModal, prevModal: modalA.modalId }));
  };

  const { errors, isPending, submit } = useForm(handleSuccess);
  return (
    <form className="mt-5 flex flex-col gap-y-4" onSubmit={submit}>
      <label
        htmlFor="roomField"
        className="flex flex-col gap-y-3 text-base font-medium text-black">
        Nombre
        <FormInput
          placeholder="Nombre de la sala"
          name="roomName"
          type="text"
          id="roomField"
          autoComplete="off"
          password={false}
        />
      </label>
      <div className="flex flex-col gap-y-3">
        <span className="text-base font-medium text-black">Aspecto</span>
        <PresetRadioItem
          name="roomPreset"
          id="centralPreset"
          value={'CENTRAL'}
          img="hola"
          title="📍Central Hub"
          sub="Central y multifuncional donde todos pueden reunirse."
        />
        <PresetRadioItem
          name="roomPreset"
          id="DevPreset"
          value={'FORGE'}
          title="⚒La forja dev"
          sub="Un lugar donde el código toma forma."
        />
        <PresetRadioItem
          name="roomPreset"
          id="DesignPreset"
          value={'DESIGN'}
          title="🎨Estudio de diseño"
          sub="El espacio donde la creatividad fluye."
        />
        <PresetRadioItem
          name="roomPreset"
          id="ZenPreset"
          value={'ZENZONE'}
          title="☘Zona Zen"
          sub="Un lugar para relajarse y despejarse."
        />
        <PresetRadioItem
          name="roomPreset"
          id="CheckinPreset"
          value={'DAILY'}
          title="☕Check-in Diario"
          sub="Una verificación rápida y diaria del progreso del equipo."
        />
      </div>
      <div className="mt-12 flex items-center justify-end gap-x-4">
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
          Crear Sala
        </Button>
      </div>
    </form>
  );
};
