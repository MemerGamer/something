import { createSlice } from '@reduxjs/toolkit';
import ApiService, { ApiError, ApiResponse } from '../../services/ApiService';
import { RootState } from '../store';

export type SettingsDTO = ApiResponse<typeof api.client.user.me.settings.$url, 200>;

type InitialState = {
  settings: SettingsDTO | undefined;
  loading: boolean;
  error: ApiError | undefined;
};

const initialState: InitialState = {
  settings: undefined,
  loading: true,
  error: undefined
};

const api = new ApiService();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {}
});

export const settingsReducer = settingsSlice.reducer;
export const settingsSelector = (state: RootState) => state.settingsReducer;
