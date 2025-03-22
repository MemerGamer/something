import { useState } from 'react';
import ApiService from '../../services/ApiService';

const api = new ApiService();

export const useJoinSocialThingScreenLogic = (navigation: any) => {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    // dispatch(resetNewPersonalThing());
    navigation.pop();
  };

  const handleJoinSocialThing = async () => {
    const result = await api.call(api.client.things['join-by-code'].$post, {
      json: {
        joinCode: joinCode
      }
    });

    const data: any = await result.json();
    const thingId = data.thingId;
    navigation.navigate('SocialDetails', {
      thingId: thingId
    });
  };
  return {
    handleCancel,
    handleJoinSocialThing,
    joinCode,
    setJoinCode,
    loading,
    setLoading
  };
};
