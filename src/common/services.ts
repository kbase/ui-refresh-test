import { KBaseServiceClient } from '@kbase/narrative-utils';

const ENV = process.env.REACT_APP_KBASE_ENV;
const BASE_URI = `https://${ENV === 'PROD' ? '' : `${ENV}.`}kbase.us`;

const URLS = {
  UserProfile: `${BASE_URI}/services/user_profile/rpc`,
} as const;

export const getServiceClient = (service: keyof typeof URLS, token: string) => {
  return new KBaseServiceClient({
    module: service,
    url: URLS[service],
    authToken: token,
  });
};
