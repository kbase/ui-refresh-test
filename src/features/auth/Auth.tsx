import { useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  usePageTitle,
} from '../../common/hooks';
import { authFromToken, revokeCurrentToken } from './authSlice';

export default function Auth() {
  usePageTitle('Authentication');
  const { username, token, error, pending } = useAppSelector(
    (state) => state.auth
  );
  return (
    <div>
      <p>
        {token ? `You are logged in as '${username}'` : `You are not logged in`}
      </p>
      {pending ? <p>Please wait...</p> : token ? <LogoutForm /> : <AuthForm />}
      {error ? <span style={{ color: 'red' }}>{error}</span> : null}
    </div>
  );
}

const AuthForm = () => {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string>();
  const doLogin = () => {
    if (token) {
      dispatch(authFromToken(token));
    } else {
      alert('Please enter a kbase token');
    }
  };
  return (
    <div>
      <input
        placeholder="kbase token"
        type="text"
        value={token ?? ''}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={doLogin}>Login</button>
    </div>
  );
};

const LogoutForm = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <button onClick={() => dispatch(revokeCurrentToken())}>
        Logout of KBase
      </button>
    </div>
  );
};
