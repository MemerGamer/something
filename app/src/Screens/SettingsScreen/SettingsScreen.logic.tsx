import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { authSelector, logout } from '../../redux/auth/AuthSlice';
import { getUserType, postTypeRequest, settingsSelector } from '../../redux/settings/SettingsStack';
import { RootState } from '../../redux/store';

export const useSettingsScreenLogic = () => {
  const [requestSent, setRequestSent] = useState(false);
  const { useDeviceTheme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const { userType, loading, error } = useAppSelector((state: RootState) => state.settingsReducer);

  useEffect(() => {
    dispatch(getUserType());
  }, [dispatch]);

  console.log('User Type:', userType);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = toggleTheme;

  const handleRequestOrganizationRole = async () => {
    if (userType === 'user') {
      if (requestSent) {
        return;
      }
      await dispatch(postTypeRequest());

      setRequestSent(true);
    } else {
      console.log(userType + 'cannot request organization role');
    }
  };

  const handleChangeUsername = () => {};

  //   return { loading, error, user, settings };
  return {
    handleLogout,
    handleToggleTheme,
    handleRequestOrganizationRole,
    handleChangeUsername,
    requestSent,
    userType,
    loading,
    error
  };
};
