import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageState {
  pageTitle?: string;
  environment: 'unknown' | 'production' | 'ci' | 'appdev';
}

const initialState: PageState = {
  pageTitle: undefined,
  environment: 'unknown',
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string | undefined>) => {
      state.pageTitle = action.payload;
    },
    setEnvironment: (
      state,
      action: PayloadAction<PageState['environment']>
    ) => {
      state.environment = action.payload;
    },
  },
});

export default pageSlice.reducer;
export const { setPageTitle, setEnvironment } = pageSlice.actions;
