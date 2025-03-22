import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import RespositoryService from '../../services/RespositoryService';
import { RootState } from '../store';
import ApiService, { ApiError, ApiRequest, ApiResponse } from '../../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NewThingDTO = ApiRequest<typeof api.client.things.create.$post>['json'];

interface ThingState {
  newThing: NewThingDTO;
  newSocialThing: {
    location: string;
    uri: string;
    visibility: string;
  };
  userThings: {
    home: ApiResponse<typeof api.client.things.mine.today.$get, 200>;
    all: ApiResponse<typeof api.client.things.mine.today.all.$get, 200>;
  };
  otherThings: {
    home: ApiResponse<typeof api.client.things.others.today.$get, 200>;
  };
  loading: boolean;
  error: ApiError | undefined;
  newThingSent: boolean;
}

const initialState: ThingState = {
  newThing: {
    name: '',
    description: '',
    schedule: undefined as any,
    sharedUsernames: []
  },
  newSocialThing: {
    location: '',
    uri: '',
    visibility: ''
  },
  userThings: {
    home: [],
    all: []
  },
  otherThings: {
    home: []
  },
  loading: false,
  error: undefined,
  newThingSent: false
};

const api = new ApiService();

export const getUserThingsToday = createAsyncThunk('thing/getUserThingsToday', async (_, { rejectWithValue }) => {
  const response = await api.call(api.client.things.mine.today.$get, {});
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return rejectWithValue({});
});

export const getUserThingsTodayAll = createAsyncThunk('thing/getUserThingsTodayAll', async (_, { rejectWithValue }) => {
  const response = await api.call(api.client.things.mine.today.all.$get, {});
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return rejectWithValue({});
});

export const getOtherThingsToday = createAsyncThunk('thing/getOtherThingsToday', async (_, { rejectWithValue }) => {
  const response = await api.call(api.client.things.others.today.$get, {});
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return rejectWithValue({});
});

export const createThing = createAsyncThunk('thing/createThing', async (_, { rejectWithValue, getState }) => {
  const thing = (getState() as RootState).thingReducer.newThing;

  const response = await api.call(api.client.things.create.$post, { json: thing });
  if (response.ok) {
    return 'ok';
  }

  if (response.status === 400) {
    const error = await response.json();
    console.log('[thing/createThing] error %s', JSON.stringify(error, null, 2));
    return rejectWithValue(error);
  }

  return rejectWithValue({ type: 'general', message: 'Could not save, please try again.' } as ApiError);
});

export const toggleSocialThingNotifications = createAsyncThunk(
  'thing/toggleSocialThingNotifications',
  async (thingId: string, { rejectWithValue, getState }) => {
    const response = await api.call(api.client.things['toggle-notified'].$patch, { json: { thingId } });
    if (response.ok) {
      return 'ok';
    }

    if (response.status === 400) {
      return rejectWithValue({ type: 'general', message: 'Operation not permitted when you created it.' } as ApiError);
    }

    return rejectWithValue({ type: 'general', message: 'Could not save, please try again.' } as ApiError);
  }
);

export const createSocialThing = createAsyncThunk(
  'thing/createSocialThing',
  async (_, { rejectWithValue, getState }) => {
    const thing = (getState() as RootState).thingReducer.newThing;
    const extradata = (getState() as RootState).thingReducer.newSocialThing;

    if (!thing.name || !thing.description || !extradata.location || !thing.schedule) {
      return rejectWithValue({ type: 'general', message: 'Please fill in all the fields.' } as ApiError);
    }

    const body = new FormData();

    body.append('name', thing.name);
    body.append('description', thing.description);
    body.append('location', extradata.location);
    body.append('visibility', extradata.visibility);
    body.append('schedule', JSON.stringify(thing.schedule));
    // @ts-ignore
    body.append('image', {
      uri: extradata.uri,
      name: 'image',
      type: 'image/jpg'
    });

    const response = await api.postFormData('things/create-social', {
      body,
      token: (await AsyncStorage.getItem('accessToken')) || ''
    });

    if (!response) {
      return rejectWithValue({ type: 'general', message: 'Could not save, please try again.' } as ApiError);
    }

    return 'ok';
  }
);

const thingSlice = createSlice({
  name: 'thing',
  initialState,
  reducers: {
    setNewPersonalThing: (state, action: PayloadAction<NewThingDTO>) => {
      state.newThing = action.payload;
    },
    resetNewPersonalThing: (state) => {
      state.newThing = initialState.newThing;
      state.error = undefined;
      state.loading = false;
      state.newThingSent = initialState.newThingSent;
    },
    setScheduleForNewPersonalThing: (state, action: PayloadAction<NewThingDTO['schedule']>) => {
      state.newThing!.schedule = action.payload;
    },
    setNameForNewPersonalThing: (state, action: PayloadAction<string>) => {
      state.newThing!.name = action.payload;
    },
    setDescriptionForNewPersonalThing: (state, action: PayloadAction<string>) => {
      state.newThing!.description = action.payload;
    },
    setSharedUserNamesForNewPersonalThing: (state, action: PayloadAction<string[]>) => {
      state.newThing!.sharedUsernames = action.payload;
    },
    setLocationForNewPersonalThing: (state, action: PayloadAction<string>) => {
      state.newSocialThing.location = action.payload;
    },
    setUriForNewPersonalThing: (state, action: PayloadAction<string>) => {
      state.newSocialThing.uri = action.payload;
    },
    setVisbilityForNewThing: (state, action: PayloadAction<string>) => {
      state.newSocialThing.visibility = action.payload;
    }
  },
  extraReducers: (builder) => {
    // getUserThingsToday
    builder.addCase(getUserThingsToday.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserThingsToday.fulfilled, (state, action) => {
      state.loading = false;
      state.userThings.home = action.payload;
    });
    builder.addCase(getUserThingsToday.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // getOtherThingsToday
    builder.addCase(getOtherThingsToday.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOtherThingsToday.fulfilled, (state, action) => {
      state.loading = false;
      state.otherThings.home = action.payload;
    });
    builder.addCase(getOtherThingsToday.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // getUserThingsTodayAll
    builder.addCase(getUserThingsTodayAll.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserThingsTodayAll.fulfilled, (state, action) => {
      state.loading = false;
      state.userThings.all = action.payload;
    });
    builder.addCase(getUserThingsTodayAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // createThing
    builder.addCase(createThing.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(createThing.fulfilled, (state, _) => {
      state.loading = false;
      state.error = undefined;
      state.newThingSent = true;
    });
    builder.addCase(createThing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // createSocialThing
    builder.addCase(createSocialThing.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(createSocialThing.fulfilled, (state, _) => {
      state.loading = false;
      state.error = undefined;
      state.newThingSent = true;
    });
    builder.addCase(createSocialThing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // toggleSocialThingNotifications
    builder.addCase(toggleSocialThingNotifications.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(toggleSocialThingNotifications.fulfilled, (state, _) => {
      state.loading = false;
      state.error = undefined;
      state.newThingSent = true;
    });
    builder.addCase(toggleSocialThingNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });
  }
});

export const thingReducer = thingSlice.reducer;
export const thingSelector = (state: RootState) => state.thingReducer;
export const {
  setNewPersonalThing,
  resetNewPersonalThing,
  setScheduleForNewPersonalThing,
  setNameForNewPersonalThing,
  setDescriptionForNewPersonalThing,
  setSharedUserNamesForNewPersonalThing,
  setLocationForNewPersonalThing,
  setUriForNewPersonalThing,
  setVisbilityForNewThing
} = thingSlice.actions;
