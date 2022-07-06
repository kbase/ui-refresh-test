import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getServiceClient } from '../../common/services';
import { WorkspaceObject } from '../../common/models/WorkspaceObject';
import { AuthState } from '../auth/authSlice';
import { KBaseJsonRpcError } from '@kbase/narrative-utils';
import { useGetwsObjectByNameQuery } from '../../common/api';

export type UPA = string;

interface NavigatorState {
  narrativeCache: { [key: UPA]: WorkspaceState };
}
interface WorkspaceState {
  data: WorkspaceObject;
  error: string | null;
  loading: boolean;
}

// export const narrativePreview = createAsyncThunk<
//   WorkspaceObject,
//   UPA,
//   { rejectValue: string }
// >('narrativePreview', async (upa, thunkAPI) => {
//   const state = thunkAPI.getState() as {
//     navigator: NavigatorState;
//     auth: AuthState;
//   };
//   const { narrativeCache } = state.navigator;

//   if (upa in narrativeCache && !narrativeCache[upa].loading) {
//     return narrativeCache[upa];
//   }

//   const client = getServiceClient('Workspace', state.auth.token);
//   try {
//     const response = await client.call('get_objects2', [
//       { objects: [{ ref: upa }] },
//     ]);
//     return response.data[0].data;
//   } catch (e) {
//     if (e instanceof KBaseJsonRpcError) {
//       const { message } = e.data ?? e;
//       console.error(message); // eslint-disable-line no-console
//       throw new Error(message);
//     }
//     throw new Error(e as string);
//   }
// });

export const narrativePreview = createAsyncThunk<any, any, any>(
  'narrativePreview',
  async (upa, thunkAPI) => {
  const state = thunkAPI.getState() as {
      navigator: NavigatorState;
      auth: AuthState;
    };
    /** the magic goes here */
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
            error: null,
            data: action.payload,
            loading: false,
          },
        };
      })
      .addCase(narrativePreview.rejected, (state, action) => {
        state.narrativeCache = {
          ...state.narrativeCache,
          [action.meta.arg]: {
            error: (action.error as any).message ?? null,
            data: {},
            loading: false,
          },
        };
      })
      .addCase(narrativePreview.pending, (state, action) => {
        state.narrativeCache = {
          ...state.narrativeCache,
          [action.meta.arg]: { error: null, data: {}, loading: true },
        };
      });
  },
});

export default navigatorSlice.reducer;
