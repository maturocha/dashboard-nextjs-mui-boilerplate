import { useEffect } from 'react';

interface UseScrollPositionProps {
  key: string;
  dependencies: any[];
  isReady?: boolean;
}

export const useScrollPosition = ({ key, dependencies, isReady = true }: UseScrollPositionProps) => {
  const saveScrollPosition = () => {
    localStorage.setItem(key, window.scrollY.toString());
  };

  const restoreScrollPosition = () => {
    if (isReady) {
      const savedPosition = localStorage.getItem(key);
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: 'smooth'
          });
          localStorage.removeItem(key);
        }, 100);
      }
    }
  };

  useEffect(() => {
    restoreScrollPosition();
  }, dependencies);

  return { saveScrollPosition };
}; 