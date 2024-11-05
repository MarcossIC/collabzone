import { createPortal } from 'react-dom';
import { useMoveModal } from './useMoveModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/functions/cn';

const root = document.getElementById('root-modal');

const ModalWrapper = ({ children, className, id }) => {
  const { modal, isOpen, onPointerDown, position } = useMoveModal(id);

  if (!root) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.article
          ref={modal}
          style={{
            top: position.y,
            left: position.x,
          }}
          initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300,
          }}
          onPointerDown={onPointerDown}
          role="dialog"
          aria-modal="true"
          className={cn(
            'fixed inset-0 z-10 size-full max-w-md cursor-grab touch-none rounded-4xl border border-solid border-black bg-accent-100 pt-8 shadow-drop will-change-transform active:cursor-grabbing',
            className
          )}>
          <motion.div
            onPointerDown={e => e.stopPropagation()}
            className="ignore-drag relative z-20 flex size-full grow cursor-default rounded-b-4xl active:cursor-default">
            {children}
          </motion.div>
        </motion.article>
      ) : null}
    </AnimatePresence>,
    root
  );
};

export default ModalWrapper;
