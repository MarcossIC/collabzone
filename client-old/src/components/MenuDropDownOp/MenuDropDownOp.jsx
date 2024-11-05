import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuDropDownOp = ({ img, label, items }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label={label}>
          <img
            src={img}
            decoding="async"
            width={24}
            height={24}
            className="aspect-square object-cover object-center"
          />
        </button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        <DropdownMenu.Content asChild sideOffset={40} align="start" side="right">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            className="flex min-w-44 flex-col items-center rounded-xl border border-solid border-accent-1000 bg-accent-100 shadow-drop-small">
            {items.map((item, i) => (
              <DropdownMenu.Item
                key={i}
                className="flex w-full cursor-pointer items-center justify-between rounded p-3 font-medium text-accent-1000 transition duration-200 ease-in-out first:rounded-t-xl first:border-b first:border-accent-1000 last:rounded-b-xl hover:bg-accent-300"
                onClick={item.action}>
                {item.placeholder}
                <img
                  src={item.icon}
                  alt={item.placeholder}
                  decoding="async"
                  className="aspect-square size-6"
                />
              </DropdownMenu.Item>
            ))}
          </motion.div>
        </DropdownMenu.Content>
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};
