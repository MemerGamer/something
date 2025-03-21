import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout } from '../../redux/auth/AuthSlice';
import {
  getOtherThingsToday,
  getUserThingsToday,
  thingSelector,
  toggleSocialThingNotifications
} from '../../redux/thing/ThingStack';
import ApiService, { ApiResponse } from '../../services/ApiService';

export type SocialThings = ApiResponse<(typeof api)['client']['things']['get-social']['$get'], 200>;
const api = new ApiService();

export const useSocialThingsLogic = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [socialThings, setSocialThings] = useState<SocialThings>([]);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(thingSelector);

  const getSocialThings = async () => {
    setRefreshing(true);
    try {
      const response = await api.call(api.client.things['get-social'].$get, {});
      if (response.ok) {
        const _socialThings = await response.json();
        setSocialThings(_socialThings);
      }
    } catch (err) {
      console.error('Dispatch error: ', err);
      dispatch(logout());
    }
    setRefreshing(false);
  };

  const toggleNotifications = async (thingId: string) => {
    const result = await dispatch(toggleSocialThingNotifications(thingId));

    // @ts-expect-error it actually exists
    if (!result.error) {
      const updated = socialThings.map((t) => {
        if (t.id === thingId) {
          return { ...t, notified: !t.notified, userCount: t.notified ? t.userCount - 1 : t.userCount + 1 };
        }
        return t;
      });
      setSocialThings(updated);
    }
  };

  return {
    getSocialThings,
    loading,
    error,
    socialThings,
    refreshing,
    setRefreshing,
    toggleNotifications
  };
};
