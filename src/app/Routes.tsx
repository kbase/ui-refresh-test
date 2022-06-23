import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import Auth from '../features/auth/Auth';
import Count from '../features/count/Counter';
import Legacy from '../features/legacy/Legacy';
import Navigator from '../features/navigator/Navigator';
import PageNotFound from '../features/layout/PageNotFound';
import ProfileWrapper from '../features/profile/Profile';

const Routes: FC = () => (
  <>
    <Switch>
      <Route path="/legacy/*">
        <Legacy />
      </Route>
      <Route path="/profile/:usernameRequested/narratives">
        <ProfileWrapper />
      </Route>
      <Route path="/profile/:usernameRequested">
        <ProfileWrapper />
      </Route>
      <Route path="/profile">
        <ProfileWrapper />
      </Route>
      <Route path="/count">
        <Count />
      </Route>
      <Route path="/auth">
        <Auth />
      </Route>
      <Route exact path="/">
        <Navigator />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  </>
);

export default Routes;
