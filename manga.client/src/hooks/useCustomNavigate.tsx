import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

type NavigateFunction = () => void;

export const useCustomNavigate = (
  fallbackAction: NavigateFunction | string = '/'
): NavigateFunction => {
  const navigate = useNavigate();

  const customNavigate = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (typeof fallbackAction === 'string') {
      navigate(fallbackAction);
    } else {
      fallbackAction();
    }
  }, [navigate, fallbackAction]);

  return customNavigate;
};