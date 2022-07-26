import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../app/store';

export interface JsonRpcArgs {
  method: string;
  params: unknown[];
  fetchArgs?: FetchArgs;
}

export const kbaseBaseQuery: (
  fetchBaseQueryArgs: FetchBaseQueryArgs
) => BaseQueryFn<JsonRpcArgs, unknown, FetchBaseQueryError> = (
  fetchBaseQueryArgs
) => {
  // Add auth logic to base query args
  const modifiedArgs: FetchBaseQueryArgs = {
    ...fetchBaseQueryArgs,
    prepareHeaders: async (headers, api) => {
      if (fetchBaseQueryArgs.prepareHeaders) {
        await fetchBaseQueryArgs.prepareHeaders(headers, api);
      }
      const token = (api.getState() as RootState).auth.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `${token}`);
      }
      return headers;
    },
  };

  // generate base query
  const rawBaseQuery = fetchBaseQuery(modifiedArgs);

  // wrap base query to add error handling and return
  return async (jsonRpcArgs, baseQueryAPI, extraOptions) => {
    // Generate JsonRPC request id
    const reqId = Math.random();

    // generate request body
    const fetchArgs = {
      url: '', // Just hit the baseURL
      method: 'POST',
      body: {
        version: '1.1', // TODO: conditionally implement JsonRpc 2.0
        id: reqId,
        method: jsonRpcArgs.method,
        params: jsonRpcArgs.params,
      },
      ...jsonRpcArgs.fetchArgs, // Allow overriding JsonRpc defaults
    };

    // make request
    const request = rawBaseQuery(fetchArgs, baseQueryAPI, extraOptions);
    const response = await request;

    // If an error has occured preventing a response, return default rtk-query response.
    // This appropriately handles rtk-query internal errors
    if (!response.data) return request;

    const data = response.data as {
      version: string;
      result?: unknown;
      error?: unknown;
      id?: number;
    };

    // If the IDs don't match, fail
    // TODO: find out if this is the idiomatic way to do this
    if (data.id && data.id !== reqId)
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'JsonRpcProtocolError',
          data: `Response ID "${data.id}" !== Request ID "${reqId}"`,
        },
      };

    // If we get a JsonRPC error, surface that error
    if (data.error)
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'JsonRpcError',
          data: data.error,
        },
      };

    // All went well, return the JsonRPC result
    return { data: data.result };
  };
};
