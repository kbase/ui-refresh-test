import { EnhancedStore } from '@reduxjs/toolkit';
import { pending, ProfileState } from './profileSlice';

import type { Meta } from '../../common/types';

export const realname = 'Rosalind Franklin';
export const usernameRequested = 'rosalind-franklin';
export const realnameOther = 'Dorothy Hodgkin';
export const usernameOtherRequested = 'dorothy-hodgkin';

export const initialState = {
  auth: {
    pending: false,
    token: 'a token',
    username: usernameRequested,
  },
  count: { count: 0 },
  layout: { pageTitle: '', environment: 'unknown' },
  profile: {
    cache: {},
    error: '',
    realname: '',
    usernameSelected: usernameRequested,
  },
};

export const initialStateWithCache: Meta = {
  auth: {
    pending: false,
    token: 'a token',
    username: usernameRequested,
  },
  count: { count: 0 },
  layout: { pageTitle: '', environment: 'unknown' },
  profile: {
    cache: {
      [usernameOtherRequested]: {
        user: {
          username: usernameOtherRequested,
          realname: realnameOther,
        },
        profile: {},
      },
    },
    error: '',
    pending: false,
    realname: '',
    usernameSelected: usernameRequested,
  },
};
export const pendingProfileFactory = (store: EnhancedStore) => {
  const profileIsPending = (resolve: (value: unknown) => void) => {
    const profile = store.getState().profile as ProfileState;
    const stillPending = pending({ profile });
    stillPending
      ? setTimeout(() => profileIsPending(resolve), 10)
      : resolve(true);
  };
  return profileIsPending;
};

export const pendingProfile = (store: EnhancedStore) => () =>
  new Promise((resolve) => pendingProfileFactory(store)(resolve));
