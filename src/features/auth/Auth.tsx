import { useEffect, useState } from 'react';
import {
  useGetUserProfileQuery,
  useSetUserProfileMutation,
} from '../../common/api/userProfileApi';
import { Button } from '../../common/components';
import {
  useAppSelector,
  useAppDispatch,
  usePageTitle,
} from '../../common/hooks';
import { getServiceClient } from '../../common/services';
import { authFromToken, revokeCurrentToken } from './authSlice';
import { faCheck, faX, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';

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
      <p>
        <ProfileTest />
      </p>
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

const ProfileTest = () => {
  const profile = useGetUserProfileQuery({ usernames: ['dlyon'] });
  const [updateProfile, updateProfileResult] = useSetUserProfileMutation();
  const [nameText, setNameText] = useState('');

  const changeName = async () => {
    const oldProfile = profile.data?.[0][0];
    const newProfile: typeof oldProfile = JSON.parse(
      JSON.stringify(profile.data?.[0][0])
    );
    if (newProfile === undefined) return;
    if (nameText.trim() === '') return;
    newProfile.user.realname = nameText.trim();
    updateProfile({ profile: newProfile });
  };

  return (
    <div style={{ maxWidth: '10em' }}>
      Profile:
      {profile.isSuccess ? (
        JSON.stringify(profile.data?.[0][0])
      ) : profile.isError ? (
        JSON.stringify(profile.error)
      ) : profile.isLoading ? (
        <FAIcon icon={faSpinner} spin />
      ) : (
        ' '
      )}
      <br />
      <input
        type="text"
        placeholder="Change Username"
        value={nameText}
        onInput={(e) => setNameText(e.currentTarget.value)}
      />
      <button onClick={() => changeName()}>Update</button>
      {updateProfileResult.isLoading ? <FAIcon icon={faSpinner} spin /> : null}
      {updateProfileResult.isSuccess ? <FAIcon icon={faCheck} /> : null}
      {updateProfileResult.isError ? <FAIcon icon={faX} /> : null}
    </div>
  );
};
