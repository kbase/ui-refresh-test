import { configureStore } from '@reduxjs/toolkit';
import count from '../features/count/countSlice';
import auth from '../features/auth/authSlice';
import layout from '../features/layout/layoutSlice';
import icons from '../common/slices/iconSlice';
import navigator from '../features/navigator/navigatorSlice';
import { wsObjectApi } from '../common/api';

const createStore = () =>
  configureStore({
    reducer: {
      count,
      auth,
      layout,
      icons,
      navigator,
      [wsObjectApi.reducerPath]: wsObjectApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(wsObjectApi.middleware),
  });

export const store = createStore();
export const createTestStore = createStore;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
