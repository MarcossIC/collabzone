import { cva } from 'class-variance-authority';
import { cn } from '@/utils/functions/cn';

const iconCVA = cva(
  'brutalism-box flex h-10 w-14 shrink-0 items-center justify-center rounded-2xl border-2 shadow-none',
  {
    variants: {
      color: {
        transparent: 'bg-transparent',
        white: 'bg-white',
        primary: 'bg-primary',
        secondary: 'bg-secondary-300',
        accent: 'bg-accent',
      },
      defaultVariants: { color: 'transparent' },
    },
  }
);

export default function IconBox({ children, icon, color }) {
  return (
    <div className={cn(iconCVA({ color }))}>
      <img
        className="aspect-square"
        width={24}
        height={24}
        src={icon}
        alt="Icon field"
        decoding="async"
      />
    </div>
  );
}
