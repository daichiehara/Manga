import { useState, useCallback } from 'react';

export function useDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);

  return {
    isOpen,
    toggleDrawer
  };
}
