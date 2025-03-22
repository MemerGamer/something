import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService, { ApiError, ApiResponse } from '../../services/ApiService';
import { RootState } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  accessToken: string;
  username: string;
  badges?: {
    icon: string;
    name: string;
    description: string;
  }[];
  levels?: {
    currentLevel: {
      level: string;
      minThreshold: number;
    };
    nextLevel: {
      level: string;
      minThreshold: number;
    };
  };
};

type InitialState = {
  userType: string | null;
  loading: boolean;
  error: ApiError | undefined;
  username: string;
  accessToken: string;
  message: string;
  user: User | null;
};

const initialState: InitialState = {
  userType: null,
  loading: true,
  error: undefined,
  username: '',
  accessToken: '',
  message: '',
  user: null
};

const api = new ApiService();

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

export const postTypeRequest = createAsyncThunk('profile/postTypeRequest', async (_, { rejectWithValue }) => {
  const response = await api.call(api.client.user.me['type-request'].$post, { json: { type: 'organization' } });
  if (response.ok) {
    const data = await response.json();
    return data;
  }

  return rejectWithValue({});
});

export const postUsernameChangeRequest = createAsyncThunk(
  'profile/postChangeUsernameRequest',
  async (username: string, { rejectWithValue }) => {
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

      return { accessToken: data.accessToken, username: data.newUsername, message: data.message };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'An error occurred');
      }
      return rejectWithValue('An error occurred');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
    builder.addCase(postUsernameChangeRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postUsernameChangeRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.username = action.payload.username; // Ensure this is being updated
      state.accessToken = action.payload.accessToken;
      state.message = action.payload.message;
      state.user = {
        accessToken: action.payload.accessToken,
        username: action.payload.username
      };
    });
    builder.addCase(postUsernameChangeRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as ApiError;
    });
  }
});

export const settingsReducer = settingsSlice.reducer;
export const settingsSelector = (state: RootState) => state.settingsReducer;
