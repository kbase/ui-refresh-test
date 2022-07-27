import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import count from '../features/count/countSlice';
import icons from '../common/slices/iconSlice';
import layout from '../features/layout/layoutSlice';
import profile from '../features/profile/profileSlice';
import navigator from '../features/navigator/navigatorSlice';

import { apiMiddleware, apiReducers } from '../common/api';

const createStore = () =>
  configureStore({
    devTools: true,
    reducer: {
      count,
      auth,
      layout,
      icons,
      profile,
      navigator,
      ...apiReducers,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(...apiMiddleware),
  });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const createTestStore = (preloadedState: Partial<RootState>) => {
  const config = {
    devTools: true,
    preloadedState: preloadedState,
    reducer: { auth, count, icons, layout, profile },
  };
  return configureStore(config);
};
