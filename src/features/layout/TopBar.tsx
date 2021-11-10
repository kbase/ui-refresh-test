import { FC } from 'react';
import { useAppSelector } from '../../common/hooks';
import classes from './TopBar.module.scss';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faFlask,
  faQuestionCircle,
  faSortDown,
  faUser,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

import logo from '../../common/assets/logo/46_square.png';

export default function TopBar() {
  return (
    <header className={classes.topbar}>
      <div className={classes.topbar_item}>
        <HamburgerMenu />
      </div>
      <div className={classes.topbar_item}>
        <img src={logo} alt="" />
      </div>
      <div className={[classes.topbar_item, classes.stretch].join(' ')}>
        <PageTitle />
      </div>
      <div className={classes.topbar_item}>
        <Enviroment />
      </div>
      <div className={classes.login_menu}>
        <FAIcon icon={faUser} />
        <FAIcon icon={faSortDown} />
      </div>
    </header>
  );
}

const HamburgerMenu: FC = () => {
  return (
    <div className={classes.hamburger_menu}>
      <FAIcon icon={faBars} />
    </div>
  );
};

const PageTitle: FC = () => {
  const title = useAppSelector((state) => state.layout.pageTitle);
  return (
    <div className={classes.page_title}>
      <span>{title || ''}</span>
    </div>
  );
};

const Enviroment: FC = () => {
  const env = useAppSelector((state) => state.layout.environment);
  if (env === 'production') return null;
  const icon = {
    ci: faFlask,
    unknown: faQuestionCircle,
    appdev: faWrench,
  }[env];
  const txt = {
    ci: 'CI',
    unknown: '??',
    appdev: 'APPDEV',
  }[env];
  return (
    <div className={classes.environment}>
      <span>{txt}</span>
      <FAIcon icon={icon} />
    </div>
  );
};
