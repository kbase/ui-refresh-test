import { KBaseServiceClient } from '@kbase/narrative-utils';
export { KBaseJsonRpcError } from '@kbase/narrative-utils';

const ENV = process.env.REACT_APP_KBASE_ENV;
const BASE_URI = `https://${ENV === 'PROD' ? '' : `${ENV}.`}kbase.us`;

const URLS = {
  UserProfile: `${BASE_URI}/services/user_profile/rpc`,
  ServiceWizard: `${BASE_URI}/services/service_wizard`,
  Auth: `${BASE_URI}/services/auth`,
} as const;

const STATIC_CLIENTS: Partial<Record<keyof typeof URLS, KBaseServiceClient>> =
  {};

export const getServiceClient = (
  service: keyof typeof URLS,
  token: string
): KBaseServiceClient => {
  const client =
    STATIC_CLIENTS[service] ||
    new KBaseServiceClient({
      module: service,
      url: URLS[service],
      authToken: token,
    });
  if (!STATIC_CLIENTS[service]) STATIC_CLIENTS[service] = client;
  return client;
};

const DYNAMIC_CLIENTS: Record<
  string,
  Record<string, KBaseDynamicServiceClient>
> = {};

export const getDynamicServiceClient = (
  service: string,
  token: string,
  version = 'release'
) => {
  if (Object.keys(DYNAMIC_CLIENTS).includes(service))
    throw new Error(`Service "${service}" is not dynamic`);
  if (!DYNAMIC_CLIENTS[service]) DYNAMIC_CLIENTS[service] = {};
  if (!DYNAMIC_CLIENTS[service][version]) {
    DYNAMIC_CLIENTS[service][version] = new KBaseDynamicServiceClient({
      module: service,
      authToken: token,
      version: version,
    });
  }
  return DYNAMIC_CLIENTS[service][version];
};

/** Temporary Client class, should be moved into narrative-utils
 * TODO: remove this class and use the one in narrative-utils
 */
class KBaseDynamicServiceClient extends KBaseServiceClient {
  cache_timeout = 300000; // 5 minutes

  version: string;
  cache_timestamp: number;

  constructor(config: { module: string; authToken: string; version: string }) {
    super({
      module: config.module,
      authToken: config.authToken,
      url: '',
    });
    this.cache_timestamp = -1;
    this.version = config.version;
    this.updateURL(true);
  }

  async updateURL(forceUpdate = false) {
    const now = Date.now();
    const needsUpdate = now - this.cache_timestamp > this.cache_timeout;

    if (!(forceUpdate || needsUpdate)) return;

    const ServiceWizard = await getServiceClient(
      'ServiceWizard',
      this.authToken
    );
    const result = (await ServiceWizard.call('get_service_status', [
      {
        module_name: this.module,
        version: this.version,
      },
    ])) as {
      module_name: string;
      version: string;
      git_commit_hash: string;
      release_tags: string[];
      hash: string;
      url: string;
      up: boolean;
      status: string;
      health: string;
    };
    this.url = result.url;
    this.cache_timestamp = now;
  }

  async call(
    method: string,
    params: Array<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<ReturnType<KBaseServiceClient['call']>> {
    await this.updateURL();
    return super.call(method, params);
  }
}
