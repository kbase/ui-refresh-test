import { configureStore } from '@reduxjs/toolkit';
import type { Meta } from '../common/types';
import auth from '../features/auth/authSlice';
import count from '../features/count/countSlice';
import icons from '../common/slices/iconSlice';
import layout from '../features/layout/layoutSlice';
import profile from '../features/profile/profileSlice';

const createStore = (preloadedState?: Meta) => {
  const config = {
    devTools: true,
    preloadedState: preloadedState ? preloadedState : {},
    reducer: { auth, count, icons, layout, profile },
  };
  return configureStore(config);
};

export const store = createStore();
export const createTestStore = (preloadedState?: Meta) =>
  createStore(preloadedState);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
