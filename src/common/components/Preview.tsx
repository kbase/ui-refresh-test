import TypeIcon from './TypeIcon';
import AppCellIcon from './AppCellIcon';
import { NarrativeDoc } from './NarrativeList/NarrativeDoc';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { narrativePreview, UPA } from '../../features/navigator/navigatorSlice';
import { getFormattedCells, FormattedCell } from '../utils/getFormattedCells';
import classes from './Preview.module.scss';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { AppTag } from '../slices/iconSlice';
import DefaultIcon from './DefaultIcon';

interface PreviewWrapperProps {
  narrative: NarrativeDoc;
}

interface PreviewSelector {
  cells?: FormattedCell[];
  error: string | null;
  loading: boolean;
}

const PreviewWrapper: FC<PreviewWrapperProps> = ({ narrative }) => {
  const dispatch = useAppDispatch();
  const { access_group, obj_id, version } = narrative;
  const upa: UPA = `${access_group}/${obj_id}/${version}`;

  const { cells, error, loading }: PreviewSelector = useAppSelector((state) => {
    const wsState = state.navigator.narrativeCache[upa];
    try {
      const { error, loading } = wsState;
      return { error, loading, cells: getFormattedCells(wsState.data) };
    } catch {
      return { cells: [], error: null, loading: false };
    }
  });

  useEffect(() => {
    dispatch(narrativePreview(upa));
  }, [upa, dispatch]);

  if (loading) {
    return (
      <div className={classes.preview_loading}>
        <p>
          <FAIcon icon={faCog} className={classes.loading_wheel} spin />
          loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.error}>
        <div>An error happened while getting narrative info:</div>
        <pre>{error}</pre>
      </div>
    );
  }

  return <Preview maxLength={16} wsId={access_group} cells={cells} />;
};

export default PreviewWrapper;

interface PreviewProps {
  maxLength: number;
  wsId: number;
  cells: FormattedCell[];
}

export const Preview: FC<PreviewProps> = ({ maxLength, wsId, cells }) => {
  return (
    <div>
      <div>
        {cells.slice(0, maxLength).map((cell, idx) => (
          <PreviewCell {...cell} key={idx} />
        ))}
      </div>
      {cells.length > maxLength && (
        <p>
          + {cells.length - maxLength} more cell{cells.length > 1 ? 's' : ''}
        </p>
      )}
      <p>
        <a className={classes.full_narrative_link} href={`/narrative/${wsId}`}>
          View the full narrative
        </a>
      </p>
    </div>
  );
};

const PreviewCell: FC<FormattedCell> = ({
  title,
  subtitle,
  metaName,
  cellType,
  tag,
}) => {
  function getIcon() {
    switch (cellType) {
      case 'app':
        return (
          <AppCellIcon
            appId={metaName ?? ''}
            appTag={(tag as AppTag) ?? AppTag.dev}
          />
        );
      case 'data':
        return <TypeIcon objType={metaName ?? ''} />;
      default:
        return <DefaultIcon cellType={cellType ?? ''} />;
    }
  }
  if (subtitle?.startsWith(title as string)) {
    subtitle = subtitle.slice((title ?? '').length);
  }
  return (
    <div className={classes.preview_cell_container_outer}>
      <div>{getIcon()}</div>
      <div className={classes.preview_cell_container_inner}>
        <div>{title}</div>
        <div className={classes.preview_cell_subtitle}>{subtitle}</div>
      </div>
    </div>
  );
};
