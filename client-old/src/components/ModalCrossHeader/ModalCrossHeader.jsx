import Button from '../Button/Button';
import crossicon from '/public/svg/crossIcon.svg';

export const ModalCrossHeader = ({ title, close }) => {
  return (
    <div className="flex justify-between">
      <h3 className="text-lg font-medium leading-7 text-accent-1000">{title}</h3>
      <Button
        variant="transparent"
        size="fit"
        className="p-0 text-accent-1000"
        onClick={close}>
        <img
          src={crossicon}
          width={24}
          height={24}
          className="aspect-square"
          decoding="async"
        />
      </Button>
    </div>
  );
};
