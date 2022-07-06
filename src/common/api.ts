import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wsObjectApi = createApi({
  reducerPath: 'wsObjectApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://ci.kbase.us/services/ws' }),
  endpoints: (builder) => ({
    getwsObjectByName: builder.query<any, string>({
      query: (upa) => ({
        url: '',
        method: 'POST',
        body: {
          version: '1.1',
          method: 'Workspace.get_objects2',
          id: '42',
          params: [{ objects: [{ ref: '67470/1/6' }] }],
        },
      }),
    }),
  }),
})

export const { useGetwsObjectByNameQuery } = wsObjectApi;
