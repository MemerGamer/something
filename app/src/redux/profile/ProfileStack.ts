import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import ApiService, { ApiError, ApiResponse } from '../../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSilently } from '../auth/AuthSlice';
export type ProfileDTO = ApiResponse<typeof api.client.user.me.profile.$get, 200>;
export type GalleryImageDTO = {
  imageUrl: string;
  thingId: string;
  createdAt: string;
  isSocial: boolean;
};

type InitialState = {
  profile: ProfileDTO | undefined;
  galleryImages: GalleryImageDTO[];
  userType: string | null;
  username: string;
  accessToken: string;
  message: string;
  loading: boolean;
  error: ApiError | undefined;
};

const initialState: InitialState = {
  profile: undefined,
  galleryImages: [],
  userType: null,
  username: '',
  accessToken: '',
  message: '',
  loading: true,
  error: undefined
};

const api = new ApiService();

export const getProfileData = createAsyncThunk('profile/getProfileData', async (_, { rejectWithValue }) => {
  const response = await api.call(api.client.user.me.profile.$get, {});
  if (response.ok) {
    const data = await response.json();
    return data;
  }

  return rejectWithValue({});
});

export const getGalleryImages = createAsyncThunk('profile/getGalleryImages', async (_, { rejectWithValue }) => {
  const response = await api.call(api.client.user.me.gallery.$get, {});
  if (response.ok) {
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    return data;
  }

  return rejectWithValue({});
});

export const getUserType = createAsyncThunk('profile/getUserType', async (_, { rejectWithValue }) => {
  try {
    console.info('Making API request...');
    const response = await api.call(api.client.user.me.type.$get, {});

    console.info('API response: ', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Parsed response: ', data);
      return data;
    }

    console.error('API response not ok:', response.status, response.statusText);
    return rejectWithValue('API error');
  } catch (error) {
    console.log(error);
    return rejectWithValue(error);
  }
});

export const requestOrganizationRole = createAsyncThunk(
  'profile/requestOrganizationRole',
  async (_, { rejectWithValue }) => {
    const response = await api.call(api.client.user.me['type-request'].$post, { json: { type: 'organization' } });
    if (response.ok) {
      const data = await response.json();
      return data;
    }

    return rejectWithValue({});
  }
);

export const changeUsername = createAsyncThunk(
  'profile/changeUsername',
  async (username: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.call(api.client.user.me.username.$patch, { json: { username } });

      if (!response.ok) {
        return rejectWithValue('Failed to change username');
      }

      const data = await response.json();
      console.log(data);

      if (!data || !data.newUsername) {
        return rejectWithValue('Invalid response data');
      }

      // Store the updated values in AsyncStorage
      await AsyncStorage.setItem('username', data.newUsername);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('message', data.message);

      // Update auth state with the new token and username
      dispatch(loginSilently());

      return { accessToken: data.accessToken, username: data.newUsername, message: data.message };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'An error occurred');
      }
      return rejectWithValue('An error occurred');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getProfileData
    builder.addCase(getProfileData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(getProfileData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });
    // getGalleryImages
    builder.addCase(getGalleryImages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getGalleryImages.fulfilled, (state, action) => {
      state.loading = false;
      state.galleryImages = action.payload;
    });
    builder.addCase(getGalleryImages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // getUserType
    builder.addCase(getUserType.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserType.fulfilled, (state, action) => {
      state.userType = (action.payload as { type: string }).type;
      state.loading = false;
    });
    builder.addCase(getUserType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // requestOrganizationRole
    builder.addCase(requestOrganizationRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(requestOrganizationRole.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(requestOrganizationRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as any;
    });

    // changeUsername
    builder.addCase(changeUsername.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changeUsername.fulfilled, (state, action) => {
      state.loading = false;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.message = action.payload.message;
    });
    builder.addCase(changeUsername.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as ApiError;
    });
  }
});

export const profileReducer = profileSlice.reducer;
export const profileSelector = (state: RootState) => state.profileReducer;
