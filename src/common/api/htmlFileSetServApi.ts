import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from './utils/dynamicBaseQuery';

interface htmlFileSetServ {
  status: {
    state: string;
    message: string;
    version: string;
    git_url: string;
    git_commit_hash: string;
  };
}

export const htmlFileSetServApi = createApi({
  reducerPath: 'HTMLFileSetServ',
  baseQuery: dynamicBaseQuery('HTMLFileSetServ', 'release'),
  endpoints: (builder) => ({
    status: builder.query<[htmlFileSetServ['status']], void>({
      query: () => ({
        method: 'HTMLFileSetServ.status',
        params: [],
      }),
    }),
  }),
});

export const { useStatusQuery } = htmlFileSetServApi;
