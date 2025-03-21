import { useContext } from 'react';
import { Appearance } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { authSelector, logout } from '../../redux/auth/AuthSlice';
import { settingsSelector } from '../../redux/settings/SettingsStack';

export const useSettingsScreenLogic = () => {
  //   const { loading, error, settings } = useAppSelector(settingsSelector);
  const { useDeviceTheme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = toggleTheme;

  const handleRequestOrganizationRole = () => {};

  const handleChangeUsername = () => {};

  //   return { loading, error, user, settings };
  return { user, handleLogout, handleToggleTheme, handleRequestOrganizationRole, handleChangeUsername };
};
