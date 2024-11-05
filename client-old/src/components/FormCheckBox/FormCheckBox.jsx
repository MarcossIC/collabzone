import { useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { motion } from 'framer-motion';
import { ScrollArea } from '../ScrollArea/ScrollArea';

export const FormCheckBox = ({ items, title, sub }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleCheckboxChange = (permissionId, checked) => {
    setSelectedPermissions(prev =>
      checked ? [...prev, permissionId] : prev.filter(id => id !== permissionId)
    );
  };
  return (
    <div className="flex flex-col">
      <span className="text-base font-medium text-black">{title}</span>
      <span className="mb-5 text-sm font-medium text-black">{sub}</span>
      <ScrollArea className="-mr-4 h-full max-h-[180px] max-w-[95%]">
        <div className="space-y-3">
          {items.map(item => (
            <motion.div
              key={item.id}
              className="flex items-center space-x-2"
              whileTap={{ scale: 0.98 }}>
              <div className="relative flex size-4 items-center justify-center">
                <Checkbox
                  id={item.id}
                  className="size-4 transition-colors data-[state=checked]:border-primary-400 data-[state=checked]:bg-primary-400"
                  checked={selectedPermissions.includes(item.id)}
                  onCheckedChange={checked => handleCheckboxChange(item.id, checked)}
                />
                <motion.div
                  initial={false}
                  animate={{
                    scale: selectedPermissions.includes(item.id) ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2, type: 'spring' }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                />
              </div>
              <label
                htmlFor={item.id}
                className="cursor-pointer select-none text-base font-medium">
                {item.label}
              </label>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
