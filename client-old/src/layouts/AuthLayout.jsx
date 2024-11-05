import { cn } from '@/utils/functions/cn';
import avatarCircle from '/public/images/avatarCircle.png';

export default function AuthLayout({ children, h1 = '', h2 = '', h1Hide = false }) {
  return (
    <div className="mt-8 flex w-full flex-col items-center justify-center">
      <header className="mb-4 flex w-fit flex-col items-center justify-center font-bold">
        <h1 className={cn('mb-5 text-2xl leading-9', h1Hide ? 'sr-only' : '')}>
          {h1}
        </h1>
        <div className="mb-4 size-fit rounded-full border-2 border-solid border-black bg-secondary-100">
          <img
            src={avatarCircle}
            width={75}
            height={75}
            className="aspect-square"
            alt="Avatar"
          />
        </div>
        <h2 className="text-2xl leading-9">{h2}</h2>
      </header>
      <main className="mx-auto mb-5 w-full max-w-3xl">{children}</main>
    </div>
  );
}
