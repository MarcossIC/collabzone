import Button from '../Button/Button';
import IconBox from '../IconBox/IconBox';
import gmail from '/public/images/gmail.png';

export default function ButtonBox({
  boxText = '',
  color = 'secondary',
  variant = 'secondary',
  children,
  ...props
}) {
  return (
    <div className="brutalism-box relative w-full max-w-md -rotate-2 rounded-2xl border-black px-6 py-5 text-sm font-normal leading-4 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-field-img before:opacity-10 before:content-['']">
      <div className="font-semibold">{boxText}</div>
      <div className="relative mt-2 flex items-center space-x-4">
        <IconBox icon={gmail} color={color} />
        <Button variant={variant} size="full" {...props}>
          {children}
        </Button>
      </div>
    </div>
  );
}
