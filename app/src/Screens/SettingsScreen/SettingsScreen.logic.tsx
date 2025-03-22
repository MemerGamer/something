import { useContext, useState } from 'react';
import { Appearance } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { authSelector, logout } from '../../redux/auth/AuthSlice';
import { postTypeRequest, settingsSelector } from '../../redux/settings/SettingsStack';

export const useSettingsScreenLogic = () => {
  const [requestSent, setRequestSent] = useState(false);
  const { useDeviceTheme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = toggleTheme;

  const handleRequestOrganizationRole = async () => {
    if (requestSent) {
      return;
    }
    await dispatch(postTypeRequest());

    setRequestSent(true);
  };

  const handleChangeUsername = () => {};

  //   return { loading, error, user, settings };
  return { user, handleLogout, handleToggleTheme, handleRequestOrganizationRole, handleChangeUsername, requestSent };
};
