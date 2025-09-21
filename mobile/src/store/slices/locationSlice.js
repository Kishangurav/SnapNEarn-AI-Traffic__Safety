import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  address: null,
  isLoading: false,
  error: null,
  permissionGranted: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setPermissionGranted: (state, action) => {
      state.permissionGranted = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setCurrentLocation, setAddress, setPermissionGranted, setError, clearError } = locationSlice.actions;
export default locationSlice.reducer;
