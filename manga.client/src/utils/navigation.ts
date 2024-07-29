import { NavigateFunction } from 'react-router-dom';

let navigateFunction: NavigateFunction | null = null;

export const setNavigateFunction = (navigate: NavigateFunction) => {
  navigateFunction = navigate;
};

export const customNavigate = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.warn('Navigate function not set, falling back to window.location');
    window.location.href = path;
  }
};
