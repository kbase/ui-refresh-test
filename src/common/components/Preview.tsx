// import TypeIcon from './TypeIcon';
// import AppCellIcon from './AppCellIcon';
import { NarrativeDoc } from './NarrativeList/NarrativeDoc';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { narrativePreview, UPA } from '../../features/navigator/navigatorSlice';
import { WorkspaceObject } from '../models/WorkspaceObject';

interface PreviewProps {
  narrative: NarrativeDoc;
  // TODO: what is a KBase cache and why do we need it
}

const Preview: FC<PreviewProps> = ({ narrative }) => {
  const dispatch = useAppDispatch();
  const { access_group, obj_id, version } = narrative;
  const upa: UPA = `${access_group}/${obj_id}/${version}`;

  useEffect(() => {
    dispatch(narrativePreview(narrative));
  }, [narrative, dispatch]);

  const workspaceObject: WorkspaceObject = useAppSelector(
    (state) => state.navigator.narrativeCache[upa]
  );

  return <>{JSON.stringify(workspaceObject)}</>;
};

export default Preview;
