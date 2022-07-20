import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
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
  // Forces update when new calls are made to endpoints, every five seconds right now
  refetchOnMountOrArgChange: 5,
  endpoints: (builder) => ({
    getServiceUrl: builder.query<any, { module: string; version: string }>({
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

const dynamicServiceBaseQuery: (
  module: string,
  version: string
) => BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  (module, version) => async (args, baseQueryAPI, extraOptions) => {
    const getServiceUrl = serviceWizardApi.endpoints.getServiceUrl;
    const wizardArgs = { module, version };
    // trigger query, subscribe until we grab the value
    const subscription = baseQueryAPI.dispatch(
      getServiceUrl.initiate(wizardArgs, { subscribe: true })
    );
    // wait until the query completes
    await subscription;
    // Get the result from the cache
    const result = getServiceUrl.select(wizardArgs)(
      baseQueryAPI.getState() as RootState
    );
    // Get URL from result
    const baseUrl = result.data.result[0].url;
    // release the subscription
    subscription.unsubscribe();
    // use URL to construct basequery
    const rawBaseQuery = fetchBaseQuery({ baseUrl });
    return rawBaseQuery(args, baseQueryAPI, extraOptions);
  };

export const HTMLFileSetServAPI = createApi({
  reducerPath: 'HTMLFileSetServ',
  baseQuery: dynamicServiceBaseQuery('HTMLFileSetServ', 'release'),
  endpoints: (builder) => ({
    getStatus: builder.query<any, undefined>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          version: '1.1',
          method: 'HTMLFileSetServ.status',
          id: Math.random(),
          params: [],
        },
      }),
    }),
  }),
  // TODO: figure out how it works with DynamicServiceClient
  // TODO: figure out how it works with handling JSONRPCErrors
  // TODO: investigate mutations
});

export const { useGetStatusQuery } = HTMLFileSetServAPI;
