import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getServiceClient } from '../../common/services';
import { WorkspaceObject } from '../../common/models/WorkspaceObject';
import { AuthState } from '../auth/authSlice';

export type UPA = string;

interface NavigatorState {
  narrativeCache: { [key: UPA]: WorkspaceState };
}
interface WorkspaceState {
  data: WorkspaceObject;
  error: boolean;
  loading: boolean;
}

export const narrativePreview = createAsyncThunk<WorkspaceObject, UPA>(
  'narrativePreview',
  async (upa, thunkAPI) => {
    const state = thunkAPI.getState() as {
      navigator: NavigatorState;
      auth: AuthState;
    };
    const { narrativeCache } = state.navigator;

    if (upa in narrativeCache) {
      return narrativeCache[upa];
    }

    const client = getServiceClient('Workspace', state.auth.token);
    const response = await client.call('get_objects2', [
      { objects: { ref: upa } },
    ]);
    if (!response.ok) {
      console.error(response.statusText); // eslint-disable-line no-console
      throw new Error(`Couldn't load objects for workspace with ID "${upa}"`);
    }
    return response.data;
  }
);

const initialState: NavigatorState = {
  narrativeCache: {},
};

export const navigatorSlice = createSlice({
  name: 'navigator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(narrativePreview.fulfilled, (state, action) => {
        state.narrativeCache = {
          ...state.narrativeCache,
          [action.meta.arg]: {
            error: false,
            data: action.payload,
            loading: false,
          },
        };
      })
      .addCase(narrativePreview.rejected, (state, action) => {
        state.narrativeCache = {
          ...state.narrativeCache,
          [action.meta.arg]: { error: true, data: {}, loading: false },
        };
      })
      .addCase(narrativePreview.pending, (state, action) => {
        state.narrativeCache = {
          ...state.narrativeCache,
          [action.meta.arg]: { error: false, data: {}, loading: true },
        };
      });
  },
});

export default navigatorSlice.reducer;
