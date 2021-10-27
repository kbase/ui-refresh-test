import { configureStore } from '@reduxjs/toolkit';
import count from '../features/count/countSlice';
import auth from '../features/auth/authSlice';

const createStore = () =>
  configureStore({
    reducer: { count, auth },
  });

export const store = createStore();
export const createTestStore = createStore;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
/* Inferred type:
 *  {posts: PostsState, comments: CommentsState, users: UsersState}
 */
export type AppDispatch = typeof store.dispatch;
