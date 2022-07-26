import { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../app/store';
import { kbaseBaseQuery, JsonRpcArgs } from './kbaseBaseQuery';
import { serviceWizardApi } from '../serviceWizardApi';

export const dynamicBaseQuery: (
  module_name: string,
  version: string
) => BaseQueryFn<JsonRpcArgs, unknown, FetchBaseQueryError> = (
  module_name,
  version
) => {
  return async (args, baseQueryAPI, extraOptions) => {
    const serviceStatusQuery = serviceWizardApi.endpoints.serviceStatus;
    const wizardQueryArgs = { module_name, version };

    // trigger query, subscribing until we grab the value
    const statusQuery = baseQueryAPI.dispatch(
      serviceStatusQuery.initiate(wizardQueryArgs, { subscribe: true })
    );

    // wait until the query completes
    await statusQuery;

    // Get query result from the cache after the query has completed
    const state = baseQueryAPI.getState() as RootState;
    const wizardResult = serviceStatusQuery.select(wizardQueryArgs)(state);

    // Raise any errors from the above call to service_wizard
    if (wizardResult.isError) {
      return { error: wizardResult.error as FetchBaseQueryError };
    }

    // Get URL from wizardResult
    const baseUrl = wizardResult.data?.[0].url;

    // release the statusQuery sub
    statusQuery.unsubscribe();

    // use URL to construct basequery
    const rawBaseQuery = kbaseBaseQuery({
      baseUrl,
    });

    return rawBaseQuery(args, baseQueryAPI, extraOptions);
  };
};
