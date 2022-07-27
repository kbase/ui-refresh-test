import { createApi } from '@reduxjs/toolkit/query/react';
import { kbaseBaseQuery } from './utils/kbaseBaseQuery';

interface UserProfile {
  user: { username: string; realname: string };
  profile: unknown;
}

interface UserProfileParams {
  status: void;
  get_user_profile: { usernames: string[] };
  set_user_profile: {
    profile: UserProfile;
  };
}

interface UserProfileResults {
  status: unknown;
  get_user_profile: [[UserProfile]];
  set_user_profile: void;
}

export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery: kbaseBaseQuery({
    baseUrl: 'https://ci.kbase.us/services/user_profile/rpc',
  }),
  tagTypes: ['Profiles'],
  endpoints: (builder) => ({
    status: builder.query<
      UserProfileResults['status'],
      UserProfileParams['status']
    >({
      query: () => ({
        method: 'UserProfile.status',
        params: [],
      }),
    }),

    getUserProfile: builder.query<
      UserProfileResults['get_user_profile'],
      UserProfileParams['get_user_profile']
    >({
      query: ({ usernames }) => ({
        method: 'UserProfile.get_user_profile',
        params: [usernames],
      }),
      // Tells rtk-query the cache constraints for this query
      providesTags: (result, error, { usernames }) =>
        usernames.map((username) => ({ type: 'Profiles', id: username })),
    }),

    setUserProfile: builder.mutation<
      UserProfileResults['set_user_profile'],
      UserProfileParams['set_user_profile']
    >({
      query: ({ profile }) => ({
        method: 'UserProfile.set_user_profile',
        params: [{ profile }],
      }),
      // Invalidates the cache for any queries with a matching tag
      invalidatesTags: (result, error, { profile }) => [
        { type: 'Profiles', id: profile.user.username },
      ],
    }),
  }),
});

export const {
  useStatusQuery,
  useGetUserProfileQuery,
  useSetUserProfileMutation,
} = userProfileApi;
