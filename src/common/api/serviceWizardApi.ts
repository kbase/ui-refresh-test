import { createApi } from '@reduxjs/toolkit/query/react';
import { kbaseBaseQuery } from './utils/kbaseBaseQuery';

export const serviceWizardApi = createApi({
  reducerPath: 'serviceWizardApi',
  baseQuery: kbaseBaseQuery({
    baseUrl: 'https://ci.kbase.us/services/service_wizard',
  }),
  // Forces update when new calls are made to endpoints, every five seconds right now
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    serviceStatus: builder.query<
      [
        {
          git_commit_hash: string;
          status: string;
          version: string;
          hash: string;
          release_tags: string[];
          url: string;
          module_name: string;
          health: string;
          up: number;
        }
      ],
      { module_name: string; version: string }
    >({
      query: ({ module_name, version }) => ({
        method: 'ServiceWizard.get_service_status',
        params: [{ module_name, version }],
      }),
    }),
  }),
});

export const { useServiceStatusQuery } = serviceWizardApi;
