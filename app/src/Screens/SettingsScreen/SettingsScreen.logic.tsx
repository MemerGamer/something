import { useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAppDispatch } from '../../hooks/hooks';
import { logout } from '../../redux/auth/AuthSlice';

export const useSettingsScreenLogic = () => {
  const [requestSent, setRequestSent] = useState(false);
  const { useDeviceTheme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = toggleTheme;

  return {
    handleLogout,
    handleToggleTheme
  };
};
