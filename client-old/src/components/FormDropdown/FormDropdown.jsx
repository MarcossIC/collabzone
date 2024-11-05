import * as Select from '@radix-ui/react-select';
import dropdownIcon from '/public/svg/dropdownIcon.svg';
import { forwardRef } from 'react';
import { cn } from '@/utils/functions/cn';
import edit from '/public/svg/edit.svg';

export const FormDropdown = ({ placeholder, items = [], dropdownAction }) => {
  return (
    <div className="relative w-full min-w-full">
      <Select.Root dir="ltr" className="w-full" defaultOpen={false} name="role">
        <Select.Trigger
          type="button"
          aria-label="Roles de usuario"
          className="flex h-11 w-full items-center justify-between rounded-4xl border-2 border-solid border-neutral-1000 px-4 text-sm text-black focus:border-neutral-700">
          <Select.Value placeholder={placeholder} />
          <Select.Icon asChild>
            <img
              src={dropdownIcon}
              width={24}
              height={24}
              alt="Dropdown icon"
              decoding="async"
              className="aspect-square"
            />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content
          asChild
          side="bottom"
          position="popper"
          sideOffset={10}
          className="flex w-full min-w-[var(--radix-select-trigger-width)] flex-col rounded-2xl border-2 border-solid border-neutral-1000 transition-all ease-in">
          <div className="pointer-events-all relative box-border">
            <Select.Group>
              <div
                className="flex w-full cursor-pointer items-center justify-between rounded-t-2xl p-3 px-4 hover:bg-accent-200 active:bg-accent-300"
                onClick={dropdownAction}>
                Crear Role
                <img
                  src={edit}
                  width={24}
                  height={24}
                  alt="Role create Icon"
                  decoding="async"
                  className="aspect-square"
                />
              </div>
            </Select.Group>
            <Select.Separator className="border border-solid border-accent-1000" />
            <Select.Group asChild>
              <div className="flex flex-col gap-y-0 rounded-b-2xl">
                {items.map((item, i) => (
                  <SelectItem
                    key={i}
                    className="w-full cursor-pointer p-3 first:rounded-t-2xl last:rounded-b-2xl hover:bg-accent-200 active:bg-accent-300"
                    value={item.value}
                    textValue={item.placeholder}>
                    {item.placeholder}
                  </SelectItem>
                ))}
              </div>
            </Select.Group>
          </div>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

const SelectItem = forwardRef(
  ({ children, className, value, ...props }, forwardedRef) => {
    return (
      <Select.Item
        value={value}
        className={cn(className)}
        {...props}
        ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  }
);
