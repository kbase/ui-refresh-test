// Start a new test file for profileSlice specifically.
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { createTestStore } from '../../app/store';
import {
  initialStateWithCache,
  pendingProfile,
  usernameRequested,
  usernameOtherRequested,
  realnameOther,
} from './common';
import {
  errMsgDefault,
  errMsgKBase,
  errMsgUsername,
  errMsgUsernameParam,
  loadProfile,
  ProfileState,
} from './profileSlice';

enableFetchMocks();

let testStore = createTestStore(initialStateWithCache);
describe('The profileSlice async thunk loadProfile', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    testStore = createTestStore(initialStateWithCache);
  });

  test('uses cached profiles.', () => {
    testStore.dispatch(
      loadProfile({ token: '', username: usernameOtherRequested })
    );
    const cachedRealname = (testStore.getState().profile as ProfileState).cache[
      usernameOtherRequested
    ].user.realname;
    expect(cachedRealname).toBe(realnameOther);
  });

  test('has a default error.', async () => {
    testStore.dispatch({ type: loadProfile.rejected.type, payload: '' });
    expect(testStore.getState().profile.error).toBe(errMsgDefault);
  });

  test('has an error for loading a profile without specifying a username.', async () => {
    testStore.dispatch(loadProfile({ token: '', username: '' }));
    await pendingProfile(testStore)();
    expect(testStore.getState().profile.error).toBe(errMsgUsername);
  });

  test('has an error for http response errors.', async () => {
    fetchMock.mockResponses([JSON.stringify({}), { status: 500 }]);
    testStore.dispatch(loadProfile({ token: '', username: usernameRequested }));
    await pendingProfile(testStore)();
    expect(testStore.getState().profile.error).toBe(errMsgKBase);
  });

  test('has an error for malformed response body errors.', async () => {
    fetchMock.mockResponses([
      JSON.stringify({
        version: '1.1',
        result: [[]],
      }),
      { status: 200 },
    ]);
    testStore.dispatch(loadProfile({ token: '', username: usernameRequested }));
    await pendingProfile(testStore)();
    expect(testStore.getState().profile.error).toBe(
      errMsgUsernameParam(usernameRequested)
    );
  });
});
