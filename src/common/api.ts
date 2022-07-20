import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';

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
    getwsObjectByName: builder.query<any, string>({
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
  // TODO: figure out how it works with DynamicServiceClient
  // TODO: figure out how it works with handling JSONRPCErrors
  // TODO: investigate mutations
});

export const { useGetwsObjectByNameQuery } = wsObjectApi;

export const serviceWizardApi = createApi({
  reducerPath: 'serviceWizardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ci.kbase.us/services/service_wizard',
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
    getServiceUrl: builder.query<any, { module: string; version: string }>({
      keepUnusedDataFor: 600,
      query: ({ module, version }) => ({
        url: '',
        method: 'POST',
        body: {
          version: '1.1',
          method: 'ServiceWizard.get_service_status',
          id: Math.random(),
          params: [
            {
              module_name: module,
              version,
            },
          ],
        },
      }),
    }),
  }),
});

export const { useGetServiceUrlQuery } = serviceWizardApi;

// export const profileApi = createApi({
  // reducerPath: 'profileApi',
// })