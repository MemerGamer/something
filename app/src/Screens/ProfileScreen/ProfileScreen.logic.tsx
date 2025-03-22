import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useState } from 'react';
import { getProfileData, getGalleryImages, profileSelector } from '../../redux/profile/ProfileStack';
import { authSelector } from '../../redux/auth/AuthSlice';

export const useProfileScreenLogic = () => {
  const [refreshing, setrefreshing] = useState(true);
  const { loading, error, profile, galleryImages } = useAppSelector(profileSelector);
  const { user } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  const getData = async () => {
    setrefreshing(true);
    await dispatch(getProfileData());
    await dispatch(getGalleryImages());
    setrefreshing(false);
  };

  return { loading, error, profile, getData, refreshing, user, galleryImages };
};
