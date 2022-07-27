import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE_URL;

interface TokenInfo {
  created: number;
  expires: number;
  id: string;
  name: string | null;
  type: string;
  user: string;
  cachefor: number;
}

export interface AuthState {
  token?: string;
  username?: string;
  error?: string;
  pending?: boolean;
  _tokenInfo?: TokenInfo;
}

const initialState: AuthState = {
  pending: false,
};

export const authFromToken = createAsyncThunk(
  'auth/authFromToken',
  async (token: string) => {
    let resp: Response | undefined;
    try {
      resp = await fetch(`${AUTH_SERVICE}/api/V2/token`, {
        method: 'GET',
        headers: {
          Authorization: token || '',
        },
      });
    } catch (e) {
      console.error('Authentication Error.'); // eslint-disable-line no-console
      throw e;
    }
    if (typeof resp === 'undefined' || !resp.ok) {
      let errmsg = resp.statusText;
      try {
        const e = (await resp.json()).error;
        errmsg += `: ${e.message}`;
      } catch (e) {
        console.error('Error processing error message.'); // eslint-disable-line no-console
        throw e;
      }
      throw new Error(`Failed to validate token: "${errmsg}"`);
    }
    const tokenInfo = (await resp.json()) as TokenInfo;
    return { token, tokenInfo };
  }
);

export const revokeCurrentToken = createAsyncThunk<
  void,
  void,
  { state: { auth: AuthState } }
>('auth/revokeCurrentToken', async (_, thunkAPI) => {
  const id = thunkAPI.getState().auth._tokenInfo?.id;
  const token = thunkAPI.getState().auth.token;
  if (!id || !token) {
    throw new Error('Failed to revoke token: No token to revoke');
  }
  const resp = await fetch(`${AUTH_SERVICE}/tokens/revoke/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token || '',
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to revoke token: ${resp.statusText}`);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(authFromToken.pending, (state) => {
        state.error = undefined;
        state.pending = true;
      })
      .addCase(authFromToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.username = action.payload.tokenInfo.user;
        state._tokenInfo = action.payload.tokenInfo;
        state.pending = false;
      })
      .addCase(authFromToken.rejected, (state, action) => {
        state.error = action.error.message;
        state.username = undefined;
        state._tokenInfo = undefined;
        state.pending = false;
      })
      .addCase(revokeCurrentToken.pending, () => undefined)
      .addCase(revokeCurrentToken.fulfilled, () => {
        return initialState;
      })
      .addCase(revokeCurrentToken.rejected, () => undefined),
});

export default authSlice.reducer;

export const authUsername = (state: RootState) => {
  if (!state.auth) return null;
  return state.auth.username;
};
