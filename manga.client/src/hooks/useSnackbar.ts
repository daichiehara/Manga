import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SnackbarContext } from '../components/context/SnackbarContext';

export const useSnackbar = () => {
  const location = useLocation();
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    if (location.state?.snackOpen) {
      showSnackbar(location.state.snackMessage);
    }
  }, [location, showSnackbar]);

  return showSnackbar;
};