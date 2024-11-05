import { modalAtom } from '@/store/modalAtom';
import { useAtom } from 'jotai';
import { useLayoutEffect } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

export const useMoveModal = id => {
  const [modalA, setModal] = useAtom(modalAtom);
  const [shiftPosition, setShiftPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setMoving] = useState(false);
  const modal = useRef();
  const initialAdjustmentMade = useRef(false);

  const onPointerDown = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      if (!modal.current || !modalA.open || e.target.closest('.ignore-drag')) return;
      const shiftX = e.clientX - modal.current.getBoundingClientRect().left;
      const shiftY = e.clientY - modal.current.getBoundingClientRect().top;
      setShiftPosition({ x: shiftX, y: shiftY });
      setMoving(true);
      document.documentElement.style.setProperty('--pointer-events-control', 'none');
    },
    [modalA.open]
  );

  const onPointerMove = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      if (!modal.current || !isMoving || !e.isPrimary) return;
      const modalWidth = modal.current.offsetWidth;
      const modalHeight = modal.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = e.pageX - shiftPosition.x - window.scrollX;
      let newY = e.pageY - shiftPosition.y - window.scrollY;

      newX = Math.max(0, Math.min(newX, viewportWidth - modalWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - modalHeight));

      setPosition({ x: newX, y: newY });
    },
    [shiftPosition, isMoving]
  );

  const onPointerStop = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      if (!isMoving) return;

      setMoving(false);
      document.documentElement.style.setProperty('--pointer-events-control', 'auto');
    },
    [isMoving]
  );

  useLayoutEffect(() => {
    const margin = 20;
    if (
      modalA.open &&
      modalA.modalId === id &&
      modal.current &&
      !initialAdjustmentMade.current
    ) {
      const modalHeight = modal.current.offsetHeight;
      const modalWidth = modal.current.offsetWidth;
      const [currentY, currentX] = modalA.coords;
      console.log('modalA.coords', modalA.coords);
      let newY = currentY;
      if (!initialAdjustmentMade.current) {
        if (modalA.position === 'top') {
          newY -= modalHeight;
        } else if (modalA.position === 'bottom') {
          newY += modalHeight;
        }

        // Asegura que el modal no salga de los límites de la pantalla
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let adjustedX = currentX - modalWidth / 2.5;
        let adjustedY = newY;

        // Ajusta X si está fuera de los límites
        if (adjustedX < 0) adjustedX = 0;
        else if (adjustedX + modalWidth > viewportWidth)
          adjustedX = viewportWidth - modalWidth - margin;

        // Ajusta Y si está fuera de los límites
        if (adjustedY < 0) adjustedY = 0;
        else if (adjustedY + modalHeight > viewportHeight)
          adjustedY = viewportHeight - modalHeight - margin;

        setPosition({ y: adjustedY, x: adjustedX });
        initialAdjustmentMade.current = true;
      }
    }
    if (!modalA.open) {
      initialAdjustmentMade.current = false;
    }
  }, [modalA.open, modalA.modalId, id, modalA.coords]);

  useLayoutEffect(() => {
    if (isMoving) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerStop);
      window.addEventListener('pointerleave', onPointerStop);
      window.addEventListener('pointercancel', onPointerStop);
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerStop);
      window.removeEventListener('pointerleave', onPointerStop);
      window.removeEventListener('pointercancel', onPointerStop);
    };
  }, [isMoving, onPointerMove, onPointerStop]);

  return {
    modal,
    isOpen: modalA.open && modalA.modalId === id,
    onPointerDown,
    position,
  };
};
