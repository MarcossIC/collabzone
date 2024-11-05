import { cn } from '@/utils/functions/cn';
import { forwardRef } from 'react';

const ToolbarButton = forwardRef(function ToolbarButtonRef(
  { icon, alt, label, onClick, isSelected, id },
  ref
) {
  return (
    <button
      id={id}
      onClick={onClick}
      ref={ref}
      className={cn(
        'flex h-[69px] w-[86px] select-none flex-col items-center justify-center rounded-lg hover:bg-primary-200 active:border-primary-400 active:bg-primary-300',
        isSelected ? 'border border-primary-400 bg-primary-300' : 'bg-white'
      )}>
      <span>
        <img
          src={icon}
          alt={alt}
          width="24px"
          height="24px"
          className="aspect-square select-none"
        />
      </span>
      <span className="mt-2 text-sm">{label}</span>
    </button>
  );
});

export default ToolbarButton;
