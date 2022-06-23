import { FC } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '../../common/components';
import NarrativeList from '../../common/components/NarrativeList/NarrativeList';
import {
  useAppDispatch,
  useAppSelector,
  usePageTitle,
} from '../../common/hooks';
import { authUsername } from '../auth/authSlice';
import PageNotFound from '../layout/PageNotFound';
import {
  cache,
  clearError,
  error,
  loadProfile,
  selectUsername,
  usernameSelected,
} from './profileSlice';
import classes from './Profile.module.scss';

export const ProfileNarrativesMessage: FC<{
  realname: string;
  yours: boolean;
}> = ({ realname, yours }) => {
  if (yours) {
    return <span>This table shows all of your narratives.</span>;
  }
  return (
    <span>
      This table shows all narratives owned by {realname} which are also
      accessible to you.
    </span>
  );
};

export const ProfileResume: FC = () => {
  return <div>Profile Resume</div>;
};

export const NarrativesView: FC<{ realname: string; yours: boolean }> = ({
  realname,
  yours,
}) => {
  return (
    <div className={classes.narratives}>
      <ProfileNarrativesMessage realname={realname} yours={yours} />
      <NarrativeList
        items={[]}
        itemsRemaining={0}
        hasMoreItems={false}
        loading={false}
        onLoadMoreItems={() => {}} //eslint-disable-line @typescript-eslint/no-empty-function
        onSelectItem={() => {}} //eslint-disable-line @typescript-eslint/no-empty-function
        showVersionDropdown
      />
    </div>
  );
};

export const ProfileInfobox: FC<{ realname: string }> = ({ realname }) => {
  return <div>Profile Infobox for {realname}.</div>;
};

export const ProfileView: FC<{ realname: string }> = ({ realname }) => {
  return (
    <div className={classes.profile}>
      <ProfileInfobox realname={realname} />
      <ProfileResume />
    </div>
  );
};

export interface ProfileParams {
  narrativesLink: string;
  pageTitle: string;
  profileLink: string;
  realname: string;
  username: string;
  viewMine: boolean;
  viewNarratives: boolean;
}

export const Profile: FC<ProfileParams> = ({
  narrativesLink,
  pageTitle,
  profileLink,
  realname,
  username,
  viewMine,
  viewNarratives,
}) => {
  usePageTitle(pageTitle);
  return (
    <>
      <nav className={classes['profile-nav']}>
        <ul className="links">
          <li>
            <Link to={profileLink}>Profile</Link>
          </li>
          <li>
            <Link to={narrativesLink}>Narratives</Link>
          </li>
        </ul>
      </nav>
      <section className={classes['profile-narratives']}>
        {viewNarratives ? (
          <NarrativesView realname={realname} yours={viewMine} />
        ) : (
          <ProfileView realname={realname} />
        )}
        <Button>Edit</Button>
      </section>
    </>
  );
};

export const ProfileWrapper: FC = () => {
  const dispatch = useAppDispatch();
  const cachedProfiles = useAppSelector(cache);
  const errorMessage = useAppSelector(error);
  const token = useAppSelector((state) => state.auth.token);
  const usernameAuthed = useAppSelector(authUsername);
  const tokenString = token ? token : '';
  const location = useLocation();
  const viewURL = location.pathname.split('/').slice(-1)[0];
  const viewNarratives = viewURL === 'narratives';
  const { usernameRequested } = useParams<{ usernameRequested: string }>();
  // Was a username specified in the URL?
  const usernameNotSpecified =
    usernameRequested === 'narratives' || usernameRequested === undefined;
  // Am I looking at my own profile?
  const viewMine = usernameRequested === usernameAuthed || usernameNotSpecified;
  // In any case, whose profile should be shown?
  const viewUsername =
    usernameAuthed && usernameNotSpecified ? usernameAuthed : usernameRequested;
  const usernameSelectedState = useAppSelector(usernameSelected);
  // If the username has not yet been selected.
  if (usernameSelectedState !== viewUsername) {
    dispatch(selectUsername(viewUsername));
    return <>Loading</>;
  }
  // If there is an error, for now display Page Not Found.
  if (errorMessage) {
    // eslint-disable-next-line no-console
    console.error(`Error message: ${errorMessage}`);
    dispatch(clearError());
    return <PageNotFound />;
  }
  if (!usernameAuthed) {
    /* If this component is loaded first (eg. a full page refresh) then the
        authentication state will need to be populated before displaying the
        profile for the current user.
    */
    return <>Loading authentication state.</>;
  }
  const loadUsername = usernameNotSpecified ? usernameAuthed : viewUsername;
  if (!(loadUsername in cachedProfiles)) {
    dispatch(loadProfile({ token: tokenString, username: loadUsername }));
  }
  const profile = cachedProfiles[loadUsername];
  if (!profile) {
    return <>Loading user profile.</>;
  }
  const profileNames = cachedProfiles[loadUsername].user;
  const realname = profileNames.realname;
  const whoseProfile = viewMine ? 'My ' : `${realname}'s `;
  const pageTitle = realname ? `${whoseProfile} Profile` : '';
  const profileLink = viewMine ? '/profile/' : `/profile/${viewUsername}`;
  const narrativesLink = viewMine
    ? '/profile/narratives'
    : `/profile/${viewUsername}/narratives`;
  return (
    <Profile
      narrativesLink={narrativesLink}
      pageTitle={pageTitle}
      profileLink={profileLink}
      realname={realname}
      username={viewUsername}
      viewMine={viewMine}
      viewNarratives={viewNarratives}
    />
  );
};

export default ProfileWrapper;
