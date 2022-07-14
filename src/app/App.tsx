import classes from './App.module.scss';

import { BrowserRouter as Router } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../common/hooks';
import { FC, useEffect } from 'react';
import { authFromToken } from '../features/auth/authSlice';
import { setEnvironment } from '../features/layout/layoutSlice';
import { getCookie } from '../common/cookie';

import Routes from './Routes';
import { useGetwsObjectByNameQuery } from '../common/api';
import LeftNavBar from '../features/layout/LeftNavBar';
import TopBar from '../features/layout/TopBar';

import { PreviewSelector } from '../common/components/Preview';
import { getFormattedCells } from '../common/utils/getFormattedCells';
import { narrativePreview } from '../features/navigator/navigatorSlice';
const UnauthenticatedView: FC = () => (
  <>
    Set your <var>kbase_session</var> cookie to your login token.
  </>
);

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
          {token ? <Routes /> : <UnauthenticatedView />}
        </div>
      </div>
    </Router>
  );
}

const TestComponent = () => {
  const dispatch = useAppDispatch();
  // const upa = '67470/1/';
  // const upa = `67470/1/${Math.ceil(Math.random() * 6)}`;
  const upa = `67470/1/6`;
  console.log('MAGIC RANDOM UPA', upa);
  const { isError, isFetching, isSuccess, data, isLoading, refetch } =
    useGetwsObjectByNameQuery(upa);
  console.log('QUERY');
  console.log('data', data);

  // const { cells, error, loading }: PreviewSelector = useAppSelector((state) => {
  //   const wsState = state.navigator.narrativeCache[upa];
  //   try {
  //     const { error, loading } = wsState;
  //     return { error, loading, cells: getFormattedCells(wsState.data) };
  //   } catch {
  //     return { cells: [], error: null, loading: false };
  //   }
  // });
  // useEffect(() => {
  // dispatch(narrativePreview(upa));
  // }, [upa, dispatch, data]);

  if (isFetching || isLoading) {
    return <>LOADING!!!!</>;
  }
  if (isError) {
    return <>THIS IS BAD!!!! {JSON.stringify(data)}</>;
  }
  return <>{JSON.stringify(data)}</>;
};
