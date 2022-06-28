import { useAppDispatch, useAppSelector } from '../hooks';
import { FC, useEffect } from 'react';
import { IconInfo, appIcon, AppTag, isFAIcon } from '../slices/iconSlice';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classes from './AppCellIcon.module.scss';
interface AppIconProps {
  appId: string;
  appTag: AppTag;
}

const AppCellIcon: FC<AppIconProps> = ({ appId, appTag }) => {
  const dispatch = useAppDispatch();
  const icon: IconInfo = useAppSelector(
    (state) =>
      state.icons.appIconCache[appTag]?.[appId] || state.icons.loadingIcon
  );
  useEffect(() => {
    dispatch(appIcon({ appId, appTag }));
  }, [dispatch, appId, appTag]);

  const loading = icon.icon === faSpinner;

  if (!isFAIcon(icon.icon)) {
    // if icon is not an FA icon then its an image source
    return (
      <span>
        <img
          height="40"
          src={icon.icon}
          style={{ maxWidth: '2.5em', maxHeight: '2.5em', margin: 0 }}
          width="40"
          alt={icon.icon}
        />
      </span>
    );
  }
  // anything thats not an image will be the loading icon or the default icon
  return (
    <div
      className={classes.loaded_icon_outer}
      style={{ backgroundColor: icon.color }}
    >
      <FAIcon
        className={classes.loaded_icon_inner}
        icon={icon.icon}
        spin={loading}
        size="lg"
        inverse
      />
    </div>
  );
};

export default AppCellIcon;
