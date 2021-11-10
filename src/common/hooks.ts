import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { setPageTitle } from '../features/layout/layoutSlice';

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const defaultPageTitle = document.title;
// Hook to set the page & document title. Resets the title on unmount
export const usePageTitle = (title: string) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageTitle(title));
    document.title = `KBase${title !== undefined ? `: ${title}` : ''}`;
    return () => {
      dispatch(setPageTitle(undefined));
      document.title = defaultPageTitle;
    };
  }, [dispatch, title]);
  return null;
};
