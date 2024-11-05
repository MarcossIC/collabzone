import { useCallback } from 'react';
import { useState } from 'react';

export const useForm = onSubmit => {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = useCallback(
    e => {
      e.preventDefault();
      setIsPending(true);
      const form = new FormData(e.currentTarget);
      onSubmit(form)
        .then(res => {
          setErrors(res?.errors ? res.errors || {} : {});
        })
        .catch(err => {
          console.error('Form submission error:', err);
        })
        .finally(() => {
          setIsPending(false);
        });
    },
    [onSubmit, isPending, errors]
  );

  return { errors, isPending, submit };
};
