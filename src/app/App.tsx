import classes from './App.module.scss';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAppDispatch } from '../common/hooks';
import { useEffect } from 'react';
import { authFromToken } from '../features/auth/authSlice';
import { getCookie } from '../common/cookie';

import LeftNavBar from '../common/nav/LeftNavBar';
import PageNotFound from '../common/nav/PageNotFound';

import Navigator from '../features/navigator/Navigator';
import Count from '../features/count/Counter';
import Auth from '../features/auth/Auth';

export default function App() {
  const dispatch = useAppDispatch();

  // Pull token from cookie. If it exists, use it for auth.
  const token = getCookie('kbase_session');
  useEffect(() => {
    if (token) dispatch(authFromToken(token));
    // OK to ignore dispatch as dependency here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className={classes.container}>
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
