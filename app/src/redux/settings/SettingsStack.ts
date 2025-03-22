import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService, { ApiError, ApiResponse } from '../../services/ApiService';
import { RootState } from '../store';

type InitialState = {
  userType: string | null;
  loading: boolean;
  error: ApiError | undefined;
};

const initialState: InitialState = {
  userType: null,
  loading: true,
  error: undefined
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

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserType.fulfilled, (state, action) => {
        state.userType = (action.payload as { type: string }).type;
        state.loading = false;
      })
      .addCase(getUserType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  }
});

export const settingsReducer = settingsSlice.reducer;
export const settingsSelector = (state: RootState) => state.settingsReducer;
