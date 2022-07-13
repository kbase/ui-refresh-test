import { KBaseJsonRpcError, KBaseServiceClient } from '@kbase/narrative-utils';
import {
  ActionReducerMapBuilder,
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { Meta } from '../../common/types';

export const errMsgDefault = 'Error loading profile.';
export const errMsgUsername = 'No username specified.';
export const errMsgUsernameParam = (username: string) =>
  `Error loading profile for ${username}.`;
export const errMsgKBase = 'Error contacting KBase services.';

interface KBaseProfileUser extends Meta {
  username: string;
  realname: string;
}

interface KBaseProfileResponse extends Meta {
  user: KBaseProfileUser;
  profile: Meta;
}

interface KBaseProfileResponseCache extends Meta {
  [user: string]: KBaseProfileResponse;
}

// Define a type for the slice state
export interface ProfileState extends Meta {
  cache: KBaseProfileResponseCache;
  error: string;
  pending: boolean;
  realname: string;
  usernameSelected: string | null;
}

const initialState: ProfileState = {
  cache: {},
  error: '',
  pending: false,
  realname: '',
  usernameSelected: null,
};

const nullProfileFactory = (username: string): KBaseProfileResponseCache => ({
  profile: {
    user: {
      username,
      realname: '',
    },
    profile: {},
  },
});

interface LoadProfileParams {
  token: string;
  username?: string;
}

export const loadProfiles = async (token: string, usernames: string[]) => {
  const client = new KBaseServiceClient({
    module: 'UserProfile',
    url: 'https://ci.kbase.us/services/user_profile/rpc',
    authToken: token,
  });
  const profiles = await client.call('get_user_profile', [usernames]);
  return profiles;
};

export const cache = ({ profile }: { profile: ProfileState }) => profile.cache;
export const loadProfile = createAsyncThunk(
  'profile/loadProfile',
  async (
    { token, username }: LoadProfileParams,
    { getState, rejectWithValue }
  ): Promise<KBaseProfileResponseCache> => {
    if (!username) throw new Error(errMsgUsername);
    const profilesCached = cache(getState() as { profile: ProfileState });
    if (username in profilesCached) {
      return { profile: profilesCached[username] };
    }
    let profiles;
    try {
      profiles = await loadProfiles(token, [username]);
    } catch (err) {
      if (err instanceof KBaseJsonRpcError) {
        throw new Error(errMsgKBase);
      }
      throw err;
    }
    const profile: KBaseProfileResponse = profiles[0];
    if (!profile) {
      return Promise.reject(
        rejectWithValue({
          username,
          error: `Username '${username}' does not exist.`,
        })
      );
    }
    return { profile };
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
    selectUsername: (state, action) => {
      state.usernameSelected = action.payload;
    },
  },
  extraReducers: (builder): ActionReducerMapBuilder<ProfileState> =>
    builder
      .addCase(loadProfile.pending, (state) => {
        state.error = '';
        state.pending = true;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        const { profile: profileCache } =
          action.payload as KBaseProfileResponseCache;
        const { user } = profileCache;
        state.realname = user.realname;
        state.usernameSelected = user.username;
        const cache: KBaseProfileResponseCache = {
          [state.usernameSelected]: profileCache,
          ...state.cache,
        };
        state.cache = cache;
        state.pending = false;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        const payload = action.payload as Record<string, string>;
        state.pending = false;
        state.usernameSelected = null;
        const errMsg =
          action.error && action.error.message
            ? action.error.message
            : errMsgDefault;
        if (!payload) {
          state.error = errMsg;
          return;
        }
        const username = payload.username;
        state.cache[username] = nullProfileFactory(username).profile;
        state.error = `Error loading profile for ${username}.`;
        state.realname = '';
      }),
});

export default profileSlice.reducer;
export const { clearError, selectUsername } = profileSlice.actions;
export const error = ({ profile }: { profile: ProfileState }) => profile.error;
export const pending = ({ profile }: { profile: ProfileState }) =>
  profile.pending;
export const profileRealname = ({ profile }: { profile: ProfileState }) =>
  profile.realname;
export const usernameSelected = ({ profile }: { profile: ProfileState }) =>
  profile.usernameSelected;
