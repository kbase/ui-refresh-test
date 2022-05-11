import { useEffect, useState } from 'react';
import { Button } from '../../common/components';
import {
  useAppSelector,
  useAppDispatch,
  usePageTitle,
} from '../../common/hooks';
import { getServiceClient } from '../../common/services';
import { authFromToken, revokeCurrentToken } from './authSlice';

export default function Auth() {
  usePageTitle('Authentication');
  const { username, token, error, pending } = useAppSelector(
    (state) => state.auth
  );
  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!token) return;
      const clientUserProfile = getServiceClient('UserProfile', token);
      const profile = await clientUserProfile.call('get_user_profile', [
        [username],
      ]);
      console.log({ profile }); // eslint-disable-line no-console
    })();
  }, [token, username]);
  // get the realname from the profile service
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
      <Button onClick={doLogin}>Login</Button>
    </div>
  );
};

const LogoutForm = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <Button onClick={() => dispatch(revokeCurrentToken())}>
        Logout of KBase
      </Button>
    </div>
  );
};
