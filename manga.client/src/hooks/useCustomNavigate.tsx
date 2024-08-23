import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

type NavigateFunction = () => void;

export const useCustomNavigate = (
  steps: number = 1,
  fallbackAction: NavigateFunction | string = '/'
): NavigateFunction => {
  const navigate = useNavigate();

  const customNavigate = useCallback(() => {
    if (window.history.state && window.history.state.idx >= steps) {
      navigate(-steps);
    } else if (typeof fallbackAction === 'string') {
      navigate(fallbackAction);
    } else {
      fallbackAction();
    }
  }, [navigate, steps, fallbackAction]);

  return customNavigate;
};