import classes from './App.module.scss';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAppDispatch } from '../common/hooks';
import { useEffect } from 'react';
import { authFromToken } from '../features/auth/authSlice';
import { setEnvironment } from '../features/layout/layoutSlice';
import { getCookie } from '../common/cookie';

import LeftNavBar from '../features/layout/LeftNavBar';
import PageNotFound from '../features/layout/PageNotFound';

import Navigator from '../features/navigator/Navigator';
import Count from '../features/count/Counter';
import Auth from '../features/auth/Auth';
import TopBar from '../features/layout/TopBar';

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
    <Router>
      <div className={classes.container}>
        <div className={classes.topbar}>
          <TopBar />
        </div>
        <div className={classes.left_navbar}>
          <LeftNavBar />
        </div>
        <div className={classes.page_content}>
          <Switch>
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
        </div>
      </div>
    </Router>
  );
}
