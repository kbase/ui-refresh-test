import {
  faParagraph,
  faCode,
  faCube,
  faWrench,
  faDatabase,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import classes from './DefaultIcon.module.scss';

interface DefaultIconProps {
  cellType: string;
}

const DefaultIcon: FC<DefaultIconProps> = ({ cellType }) => {
  let icon: IconDefinition;
  switch (cellType) {
    case 'code':
      icon = faCode;
      break;
    case 'markdown':
      icon = faParagraph;
      break;
    case 'data':
      icon = faDatabase;
      break;
    case 'app':
      icon = faCube;
      break;
    default:
      icon = faWrench;
      break;
  }
  return (
    <span className={classes.default_icon_outer}>
      <FAIcon
        className={classes.default_icon_inner}
        icon={icon}
        size="lg"
        inverse
      />
    </span>
  );
};

export default DefaultIcon;
