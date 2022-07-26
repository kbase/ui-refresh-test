import { wsObjectApi } from './wsObjectApi';
import { serviceWizardApi } from './serviceWizardApi';
import { htmlFileSetServApi } from './htmlFileSetServApi';

// List APIs to be included in the webapp
const apiList = [wsObjectApi, serviceWizardApi, htmlFileSetServApi];

// Export collections of api reducers/middlewares to be used in createStore
export const apiReducers = collectReducers(apiList);
export const apiMiddleware = collectMiddleware(apiList);

// Below are the utils used for collecting reducers/middleware safely
interface AnyAPI {
  reducerPath: string;
  reducer: unknown;
  middleware: unknown;
}

function collectMiddleware<T extends AnyAPI[]>(apiList: T) {
  return apiList.map<T[number]['middleware']>((api) => api.middleware);
}

function collectReducers<T extends AnyAPI[]>(apiList: T) {
  const reducerRecord = apiList.reduce<
    Record<AnyAPI['reducerPath'], AnyAPI['reducer']>
  >((record, api) => {
    record[api.reducerPath] = api.reducer;
    return record;
  }, {});
  // Manually assert type for usability downstream.
  // This needs to be done because createStore requires explicitly defined keys.
  return reducerRecord as {
    [Api in T[number] as Api['reducerPath']]: Api['reducer'];
  };
}
