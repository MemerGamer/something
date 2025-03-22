import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect, useState } from 'react';
import {
  getProfileData,
  getGalleryImages,
  getUserType,
  requestOrganizationRole,
  changeUsername,
  profileSelector
} from '../../redux/profile/ProfileStack';
import { authSelector } from '../../redux/auth/AuthSlice';

export const useProfileScreenLogic = () => {
  const [refreshing, setrefreshing] = useState(false);
  const { loading, error, profile, galleryImages, userType, username } = useAppSelector(profileSelector);
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const [newUsername, setNewUsername] = useState(username || user?.username || '');
  const [requestSent, setRequestSent] = useState(false);

  const getData = async () => {
    setrefreshing(true);
    await dispatch(getProfileData());
    await dispatch(getGalleryImages());
    setrefreshing(false);
  };

  useEffect(() => {
    // Load user type when component mounts
    dispatch(getUserType());
  }, [dispatch]);

  // Update newUsername when username from store changes
  useEffect(() => {
    if (username) {
      setNewUsername(username);
    }
  }, [username]);

  const handleRequestOrganizationRole = async () => {
    if (userType === 'user') {
      if (requestSent) {
        return;
      }
      setrefreshing(true);
      await dispatch(requestOrganizationRole());
      setrefreshing(false);
      setRequestSent(true);
    } else {
      console.log(userType + ' cannot request organization role');
    }
  };

  const handleChangeUsername = async () => {
    if (newUsername.trim().length < 5) {
      return;
    }

    setrefreshing(true);
    await dispatch(changeUsername(newUsername));
    setrefreshing(false);
  };

  return {
    loading,
    error,
    profile,
    getData,
    refreshing,
    user,
    galleryImages,
    userType,
    requestSent,
    handleRequestOrganizationRole,
    handleChangeUsername,
    newUsername,
    setNewUsername,
    username
  };
};
