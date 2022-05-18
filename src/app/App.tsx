import classes from './App.module.scss';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useAppDispatch } from '../common/hooks';
import { useEffect } from 'react';
import { authFromToken } from '../features/auth/authSlice';
import { setEnvironment } from '../features/layout/layoutSlice';
import { getCookie } from '../common/cookie';

import LeftNavBar from '../features/layout/LeftNavBar';
import PageNotFound from '../features/layout/PageNotFound';
import TopBar from '../features/layout/TopBar';

import Navigator from '../features/navigator/Navigator';
import Count from '../features/count/Counter';
import Legacy from '../features/legacy/Legacy';
import Auth from '../features/auth/Auth';
import Status from '../features/status/Status';

export default function App() {
  const dispatch = useAppDispatch();

  // Pull token from cookie. If it exists, use it for auth.
  const token = getCookie('kbase_session');
  useEffect(() => {
    if (token) dispatch(authFromToken(token));
  }, [dispatch, token]);

  // Placeholder code for determining environment.
  useEffect(() => {
    dispatch(setEnvironment('ci'));
  }, [dispatch]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className={classes.container}>
        <div className={classes.topbar}>
          <TopBar />
        </div>
        <div className={classes.left_navbar}>
          <LeftNavBar />
        </div>
        <div className={classes.page_content}>
          <Switch>
            <Route path="/legacy/*">
              <Legacy />
            </Route>
            <Route path="/count">
              <Count />
            </Route>
            <Route path="/auth">
              <Auth />
            </Route>
            <Route path="/status">
              <Status />
            </Route>
            <Route exact path="/">
              <Redirect to="/narratives" />
            </Route>
            <Route exact path="/narratives">
              <Navigator />
            </Route>
            <Route exact path="/narratives/:id/:obj/:ver">
              <Navigator />
            </Route>
            <Route exact path="/narratives/:category">
              <Navigator />
            </Route>
            <Route exact path="/narratives/:category/:id/:obj/:ver">
              <Navigator />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
