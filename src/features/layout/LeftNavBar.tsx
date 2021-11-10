import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classes from './LeftNavBar.module.scss';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamation,
  faCompass,
  faUsers,
  faBook,
  faSearch,
  faSuitcase,
  faIdCard,
  faBullhorn,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export default function LeftNavBar() {
  return (
    <nav>
      <ul className={classes.nav_list}>
        <NavItem path="/" desc="Navigator" icon={faCompass} />
        <NavItem path="/orgs" desc="Orgs" icon={faUsers} />
        <NavItem path="/catalog" desc="Catalog" icon={faBook} />
        <NavItem path="/search" desc="Search" icon={faSearch} />
        <NavItem path="/jobs" desc="Jobs" icon={faSuitcase} />
        <NavItem path="/account" desc="Account" icon={faIdCard} />
        <NavItem path="/feeds" desc="Feeds" icon={faBullhorn} />
        <NavItem path="/count" desc="Count" icon={faExclamation} />
        <NavItem path="/auth" desc="Auth" icon={faExclamation} />
      </ul>
    </nav>
  );
}

const NavItem: FC<{ path: string; desc: string; icon: IconDefinition }> = ({
  path,
  desc,
  icon,
}) => {
  const location = useLocation();
  let itemClasses = classes.nav_item;
  if (location.pathname === path) {
    itemClasses += ` ${classes.active}`;
  }
  return (
    <li className={itemClasses} key={path}>
      <Link to={path}>
        <FAIcon className={classes.nav_icon} icon={icon} />
        <span className={classes.nav_desc}>{desc}</span>
      </Link>
    </li>
  );
};
