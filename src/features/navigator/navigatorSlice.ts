import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getServiceClient } from '../../common/services';
import { NarrativeDoc } from '../../common/components/NarrativeList/NarrativeDoc';
import { WorkspaceObject } from '../../common/models/WorkspaceObject';
import { AuthState } from '../auth/authSlice';

export type UPA = string;

interface NavigatorState {
  narrativeCache: { [key: UPA]: WorkspaceObject };
}

export const narrativePreview = createAsyncThunk(
  'previewCells',
  async ({ access_group, obj_id, version }: NarrativeDoc, thunkAPI) => {
    const upa: UPA = `${access_group}/${obj_id}/${version}`;
    const state = thunkAPI.getState() as {
      navigator: NavigatorState;
      auth: AuthState;
    };
    const { narrativeCache } = state.navigator;

    if (upa in narrativeCache) {
      return { obj: narrativeCache[upa], upa };
    }

    const client = getServiceClient('Workspace', state.auth.token);
    try {
      const [{ data }] = await client.call('get_objects2', [
        { objects: { ref: upa } },
      ]);
      return { obj: data, upa };
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      throw new Error(`Failed to fetch workspace data from Object "${upa}"`);
    }
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
    builder.addCase(
      narrativePreview.fulfilled,
      (state, action: PayloadAction<{ obj: WorkspaceObject; upa: UPA }>) => {
        const { obj, upa } = action.payload;
        state.narrativeCache = {
          ...state.narrativeCache,
          [upa]: obj,
        };
      }
    );
  },
});

export default navigatorSlice.reducer;
