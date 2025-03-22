import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService, { ApiError, ApiResponse } from '../../services/ApiService';
import { RootState } from '../store';

type InitialState = {
  loading: boolean;
  error: undefined;
};

const initialState: InitialState = {
  loading: false,
  error: undefined
};

const api = new ApiService();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}
});

export const settingsReducer = settingsSlice.reducer;
export const settingsSelector = (state: RootState) => state.settingsReducer;
