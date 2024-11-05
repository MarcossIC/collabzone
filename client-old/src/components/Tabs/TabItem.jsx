import { cn } from '@/utils/functions/cn';
import message from '/public/svg/message.svg';
import more from '/public/svg/more.svg';
import { Link } from 'react-router-dom';
import { modalAtom } from '@/store/modalAtom';
import { useSetAtom } from 'jotai';
import { MenuDropDownOp } from '../MenuDropDownOp/MenuDropDownOp';

export const TabItem = ({ id, name, count, sub, img, isRoom }) => {
  const Wrapper = isRoom ? Link : 'div';
  const setModal = useSetAtom(modalAtom);
  const userItems = [
    {
      placeholder: 'Ver perfil',
      action: () => alert('Proximamente'),
      icon: '/svg/user.svg',
    },
    {
      placeholder: 'Unirse a la sala',
      action: () => alert('Proximamente'),
      icon: '/svg/arrowLeft.svg',
    },
  ];
  const roomItem = [
    {
      placeholder: 'Editar sala',
      action: () => alert('Proximamente'),
      icon: '/svg/edit.svg',
    },
    {
      placeholder: 'Unirse a la sala',
      action: () => alert('Proximamente'),
      icon: '/svg/arrowLeft.svg',
    },
  ];
  return (
    <Wrapper
      to={isRoom ? `/office/${id}?roomName=${name}` : undefined}
      onClick={isRoom ? () => setModal({ open: false, modalId: '' }) : undefined}
      className="flex w-full items-center justify-between rounded px-2 py-1 transition duration-200 ease-in-out hover:bg-accent-300">
      <div className="flex w-full items-center justify-start gap-x-[11px]">
        {img ? (
          <img
            src={img}
            width={32}
            height={32}
            decoding="async"
            className={cn('size-8', isRoom ? 'rounded-lg' : 'rounded-full')}
            aria-label={isRoom ? 'Imagen de la sala' : 'Imagen del usuario'}
          />
        ) : (
          <div
            className={cn(
              'size-8 bg-neutral-700',
              isRoom ? 'rounded-lg' : 'rounded-full'
            )}></div>
        )}
        {isRoom ? (
          <p>
            {name.length > 20 ? name.slice(0, 20) + '...' : name} ({count})
          </p>
        ) : (
          <div className="flex flex-col">
            <h4>{name}</h4>
            <h5>{sub}</h5>
          </div>
        )}
      </div>
      <div className="flex gap-x-2">
        <div className="cursor-pointer" onClick={() => alert('Proximamente')}>
          <img
            src={message}
            decoding="async"
            width={24}
            height={24}
            className="aspect-square object-cover object-center"
          />
        </div>
        <MenuDropDownOp
          img={more}
          label="Opciones"
          items={isRoom ? roomItem : userItems}
        />
      </div>
    </Wrapper>
  );
};
