import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';

export const wsObjectApi = createApi({
  reducerPath: 'wsObjectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ci.kbase.us/services/ws',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getwsObjectByName: builder.query<unknown, string>({
      keepUnusedDataFor: 600,
      query: (upa) => ({
        url: '',
        method: 'POST',
        body: {
          version: '1.1',
          method: 'Workspace.get_objects2',
          id: Math.random(),
          params: [{ objects: [{ ref: upa }] }],
        },
      }),
    }),
  }),
});

export const { useGetwsObjectByNameQuery } = wsObjectApi;
