import Button from '../Button/Button';
import { cn } from '@/utils/functions/cn';
import { useForm } from '@/utils/hooks/useForm';
import RenderFields from './RenderField';

export default function FormComponent({
  fields,
  onSubmit,
  btnText = 'Continuar',
  className = '',
  btnClassName = '',
  id,
}) {
  const { errors, isPending, submit } = useForm(onSubmit);
  return (
    <form
      id={id}
      data-testid={id}
      onSubmit={submit}
      className={cn(
        className,
        'relative mx-auto mb-8 flex w-full max-w-3xl flex-col items-center justify-center gap-y-7'
      )}>
      {fields.map(field => (
        <RenderFields key={field.name} field={field} error={errors?.[field.name]} />
      ))}
      <div className="brutalism-box w-full max-w-md -rotate-2 rounded-4xl px-8 py-4">
        <Button
          type="submit"
          size="full"
          key={`${id}`}
          disabled={isPending}
          className={cn(btnClassName)}
          tabIndex={Number(fields.at(-1)?.tabindex || 0) + 1}>
          {btnText}
        </Button>
      </div>
    </form>
  );
}
