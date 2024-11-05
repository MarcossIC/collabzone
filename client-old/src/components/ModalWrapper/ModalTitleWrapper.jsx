import { cn } from '@/utils/functions/cn';
import ModalWrapper from '../ModalWrapper/ModalWrapper';

export const ModalTitleWrapper = ({
  className,
  id,
  icon,
  title,
  children,
  imgStyle,
}) => {
  return (
    <ModalWrapper className={cn('bg-primary-400 pt-16', className)} id={id}>
      <div className="relative flex w-full flex-col">
        <h3 className="pointer-events-none absolute -top-12 left-1/2 -z-10 inline-flex w-fit -translate-x-1/2 touch-none gap-x-2 text-center text-lg font-semibold text-accent-100">
          {icon ? (
            <img
              src={icon}
              decoding="async"
              width={24}
              height={24}
              className={cn('aspect-square object-cover object-center', imgStyle)}
            />
          ) : null}
          {title}
        </h3>
        {children}
      </div>
    </ModalWrapper>
  );
};
