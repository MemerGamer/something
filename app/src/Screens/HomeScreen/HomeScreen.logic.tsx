import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../redux/auth/AuthSlice';
import { getOtherThingsToday, getUserThingsToday, thingSelector } from '../../redux/thing/ThingStack';

export const useHomeScreenLogic = () => {
  const [refreshing, setRefreshing] = useState(true);
  const dispatch = useAppDispatch();
  const { loading, error, userThings, otherThings } = useAppSelector(thingSelector);

  const getTodaysThingsPreview = async () => {
    try {
      await dispatch(getUserThingsToday());
    } catch (err) {
      console.error('Dispatch error: ', err);
      dispatch(logout());
    }
  };

  const getTodaysOtherThings = async () => {
    await dispatch(getOtherThingsToday());
  };

  const getHomeThings = async () => {
    setRefreshing(true);
    await getTodaysThingsPreview();
    await getTodaysOtherThings();
    setRefreshing(false);
  };

  return {
    getHomeThings,
    getTodaysThingsPreview,
    getTodaysOtherThings,
    loading,
    error,
    userThings,
    otherThings,
    refreshing,
    setRefreshing
  };
};
