import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService, { ApiError, ApiResponse } from '../../services/ApiService';
import { RootState } from '../store';

type InitialState = {
  loading: boolean;
  error: ApiError | undefined;
};

const initialState: InitialState = {
  loading: true,
  error: undefined
};

const api = new ApiService();

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
  reducers: {}
});

export const settingsReducer = settingsSlice.reducer;
export const settingsSelector = (state: RootState) => state.settingsReducer;
