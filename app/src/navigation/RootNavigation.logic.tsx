// RootNavigation.logic.ts
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { authSelector, loginSilently } from '../redux/auth/AuthSlice';
import { profileSelector, getUserType } from '../redux/profile/ProfileStack';
import { getExpoPushToken } from '../hooks/notifications';
import { useEffect } from 'react';

export const useRootNavigationLogic = () => {
  const userState = useAppSelector(authSelector);
  const profileState = useAppSelector(profileSelector);
  const dispatch = useAppDispatch();

  // Fetch user type when the component mounts or when user changes
  useEffect(() => {
    if (userState.user) {
      dispatch(getUserType());
    }
  }, [userState.user, dispatch]);

  const signInSilently = async () => {
    const pushToken = (await getExpoPushToken())?.data;
    dispatch(loginSilently(pushToken));
  };

  return {
    // Only consider auth loading for the initial loading screen
    loading: userState.loading,
    // Keep separate loading flags for different parts of the state
    profileLoading: profileState.loading,
    user: userState.user,
    userType: profileState.userType,
    signInSilently
  };
};
