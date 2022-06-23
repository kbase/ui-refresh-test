import { render, screen } from '@testing-library/react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import type { MockParams } from 'jest-fetch-mock';
import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';

import {
  initialState,
  initialStateWithCache,
  pendingProfile,
  usernameRequested,
  usernameOtherRequested,
  realnameOther,
  realname,
} from './common';
import {
  Profile,
  ProfileInfobox,
  ProfileNarrativesMessage,
  ProfileResume,
  ProfileView,
  ProfileWrapper,
} from './Profile';

import Routes from '../../app/Routes';
import { createTestStore } from '../../app/store';
import { authFromToken } from '../auth/authSlice';

enableFetchMocks();

const tokenResponseOK: [string, MockParams] = [
  JSON.stringify({ user: usernameRequested }),
  { status: 200 },
];

export const profileResponseOKFactory = (
  username: string,
  realname: string
): [string, MockParams] => [
  JSON.stringify({
    version: '1.1',
    result: [
      [
        {
          user: {
            username: username,
            realname: realname,
          },
          profile: {},
        },
      ],
    ],
  }),
  { status: 200 },
];
const profileResponseOK = profileResponseOKFactory(usernameRequested, realname);
const profileResponseNoRealnameOK = profileResponseOKFactory(
  usernameRequested,
  ''
);
const profileOtherResponseOK = profileResponseOKFactory(
  usernameOtherRequested,
  realnameOther
);
let testStore = createTestStore(initialState);

const consoleError = jest.spyOn(console, 'error');
// This mockImplementation supresses console.error calls.
// eslint-disable-next-line @typescript-eslint/no-empty-function
consoleError.mockImplementation(() => {});
describe('Profile related components', () => {
  afterAll(() => {
    consoleError.mockRestore();
  });

  afterEach(() => {
    consoleError.mockClear();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    testStore = createTestStore(initialState);
  });

  test('renders Profile', () => {
    render(
      <Provider store={createTestStore()}>
        <Router>
          <Profile
            narrativesLink={''}
            pageTitle={''}
            profileLink={''}
            realname={''}
            username={''}
            viewMine={true}
            viewNarratives={true}
          />
        </Router>
      </Provider>
    );
  });

  test('renders ProfileInfobox', () => {
    render(<ProfileInfobox realname={realname} />);
  });

  test('renders ProfileNarrativesMessage for another user', () => {
    render(<ProfileNarrativesMessage realname={realname} yours={false} />);
  });

  test('renders ProfileResume', () => {
    render(<ProfileResume />);
  });

  test('renders ProfileView', () => {
    render(<ProfileView realname={realname} />);
  });

  test('renders ProfileWrapper', () => {
    render(
      <Provider store={createTestStore()}>
        <Router>
          <ProfileWrapper />
        </Router>
      </Provider>
    );
    const linkElement = screen.getByText(/auth/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders ProfileWrapper for my profile', async () => {
    fetchMock.mockResponses(tokenResponseOK, profileResponseOK);

    await testStore.dispatch(authFromToken('a token'));
    render(
      <Provider store={testStore}>
        <Router initialEntries={[`/profile`]}>
          <Routes />
        </Router>
      </Provider>
    );
    await pendingProfile(testStore)();
    const linkElement = screen.getByText(realname, { exact: false });
    expect(linkElement).toBeInTheDocument();
  });

  test('renders ProfileWrapper for my profile, but no realname', async () => {
    fetchMock.mockResponses(tokenResponseOK, profileResponseNoRealnameOK);

    await testStore.dispatch(authFromToken('a token'));
    render(
      <Provider store={testStore}>
        <Router initialEntries={[`/profile`]}>
          <Routes />
        </Router>
      </Provider>
    );
    await pendingProfile(testStore)();
    const linkElement = screen.getByText(/infobox/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders ProfileWrapper for another profile', async () => {
    fetchMock.mockResponses(tokenResponseOK, profileOtherResponseOK);

    await testStore.dispatch(authFromToken('a token'));
    render(
      <Provider store={testStore}>
        <Router initialEntries={[`/profile/${usernameOtherRequested}`]}>
          <Routes />
        </Router>
      </Provider>
    );
    await pendingProfile(testStore)();
    const linkElement = screen.getByText(realnameOther, { exact: false });
    expect(linkElement).toBeInTheDocument();
  });

  test('renders ProfileWrapper for usernameRequested', () => {
    render(
      <Provider store={createTestStore()}>
        <Router initialEntries={[`/profile/${usernameRequested}`]}>
          <Routes />
        </Router>
      </Provider>
    );
    const linkElement = screen.getByText(/auth/i);
    expect(linkElement).toBeInTheDocument();
  });

  /* TODO: The tests marked `error` should check that console.error is called,
   * but there is a subtle bug here. Waiting for a length of time causes an
   * infinite loop of renders. It has to do with error handling in
   * the ProfileWrapper component.
   */
  test('renders ProfileWrapper for viewUsername, logs an error', async () => {
    render(
      <Provider store={testStore}>
        <Router initialEntries={[`/profile/${usernameRequested}`]}>
          <Routes />
        </Router>
      </Provider>
    );
    const linkElement = screen.getByText(/user/i);
    expect(linkElement).toBeInTheDocument();
    // await (() => new Promise((resolve) => setTimeout(resolve, 10)))();
    await Promise.resolve(true);
  });

  test('renders ProfileWrapper for a profile, logs an error', async () => {
    const store = createTestStore();
    fetchMock.mockResponses([
      JSON.stringify({ user: usernameRequested }),
      { status: 200 },
    ]);

    await store.dispatch(authFromToken('a token'));
    render(
      <Provider store={store}>
        <Router initialEntries={[`/profile/${usernameRequested}`]}>
          <Routes />
        </Router>
      </Provider>
    );
    const linkElement = screen.getByText(/profile/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders ProfileWrapper for a profile completely ', async () => {
    const store = createTestStore();
    fetchMock.mockResponses(
      [JSON.stringify({ user: usernameRequested }), { status: 200 }],
      profileResponseOK,
      profileResponseOK
    );
    await store.dispatch(authFromToken('a token'));
    const RoutesMock: jest.MockedFunction<FC> = jest.fn((props) => (
      <Routes {...props} />
    ));
    render(
      <Provider store={store}>
        <Router initialEntries={[`/profile/${usernameRequested}`]}>
          <RoutesMock />
        </Router>
      </Provider>
    );
    await pendingProfile(store)();
    const linkElement = screen.getByText(realname, { exact: false });
    expect(linkElement).toBeInTheDocument();
    expect(RoutesMock.mock.calls[0].length).toBe(2);
  });

  test('renders ProfileWrapper for another cached profile completely ', async () => {
    const store = createTestStore(initialStateWithCache);
    fetchMock.mockResponses(
      [JSON.stringify({ user: usernameRequested }), { status: 200 }],
      profileOtherResponseOK,
      profileOtherResponseOK
    );
    await store.dispatch(authFromToken('a token'));
    render(
      <Provider store={store}>
        <Router initialEntries={[`/profile/${usernameOtherRequested}`]}>
          <Routes />
        </Router>
      </Provider>
    );
    const linkElement = screen.getByText(realnameOther, { exact: false });
    expect(linkElement).toBeInTheDocument();
  });
});
