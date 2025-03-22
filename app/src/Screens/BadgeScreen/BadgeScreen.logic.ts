import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect } from 'react';
import { getBadges, profileSelector } from '../../redux/profile/ProfileStack';

export const useBadgeScreenLogic = () => {
  const { loading, error, badges } = useAppSelector(profileSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBadges());
  }, [dispatch]);

  return {
    loading,
    error,
    badges,
    getBadges: () => dispatch(getBadges()),
    refreshing: loading
  };
};
