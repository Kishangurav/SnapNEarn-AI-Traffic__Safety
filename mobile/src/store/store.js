import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import reportSlice from './slices/reportSlice';
import locationSlice from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    reports: reportSlice,
    location: locationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
