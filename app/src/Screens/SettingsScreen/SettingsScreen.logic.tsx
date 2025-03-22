import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { authSelector, logout } from '../../redux/auth/AuthSlice';
import {
  getUserType,
  postTypeRequest,
  postUsernameChangeRequest,
  settingsSelector
} from '../../redux/settings/SettingsStack';
import { RootState } from '../../redux/store';

export const useSettingsScreenLogic = () => {
  const [requestSent, setRequestSent] = useState(false);
  const { useDeviceTheme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const { userType, loading, error, username } = useAppSelector((state: RootState) => state.settingsReducer);
  const [newUsername, setNewUsername] = useState(username);
  const [inputError, setInputError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAppSelector(authSelector);

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

  const handleChangeUsername = async () => {
    if (newUsername.trim().length < 5) {
      setInputError('Username must be at least 5 characters long');
      return;
    }

    setRefreshing(true);
    await dispatch(postUsernameChangeRequest(newUsername));
    setRefreshing(false);
  };

  //   return { loading, error, user, settings };
  return {
    handleLogout,
    handleToggleTheme,
    handleRequestOrganizationRole,
    handleChangeUsername,
    requestSent,
    userType,
    loading,
    error,
    username,
    newUsername,
    setNewUsername,
    refreshing
  };
};
