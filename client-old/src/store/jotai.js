export const useAtomWithInitialValue = (atom, initialValue) => {
  const [value, setValue] = useAtom(atom);

  useLayoutEffect(() => {
    if (typeof initialValue === 'function') {
      setValue(initialValue());
    } else {
      setValue(initialValue);
    }
  }, []);

  return [value, setValue];
};
