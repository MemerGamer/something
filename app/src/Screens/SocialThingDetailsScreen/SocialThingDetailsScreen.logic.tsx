import { useState } from 'react';
import ApiService, { ApiHeaders, ApiResponse } from '../../services/ApiService';

const api = new ApiService();
type ThingDTO = ApiResponse<(typeof api)['client']['things'][':uuid']['details']['$get'], 200>;

export const useSocialThingDetailsScreenLogic = () => {
  const [thing, setThing] = useState<ThingDTO | null>(null);
  const [refreshing, setRefreshing] = useState(true);

  const getDetails = async (id: string) => {
    setRefreshing(true);
    const response = await api.call(api.client.things[':uuid'].details.$get, { param: { uuid: id } });
    if (response.ok) {
      const data = await response.json();
      setThing(data);
    }
    setRefreshing(false);
  };
  return {
    thing,
    getDetails,
    refreshing
  };
};
