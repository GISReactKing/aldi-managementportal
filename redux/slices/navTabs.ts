import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { comparePaths } from "../../utils/helpers";

export interface INavTabs {
  title: any;
  link: string;
  id?: string | number;
  clearRedux?: () => void;
}

interface IInitialState {
  navTabs: INavTabs[];
}

const initialState: IInitialState = {
  navTabs: [],
};

export const navTabsSlice = createSlice({
  name: "navTabs",
  initialState,
  reducers: {
    addNavTab: (
      state: typeof initialState,
      { payload }: PayloadAction<{ navTab: INavTabs }>
    ) => {
      state.navTabs.push(payload.navTab);
    },
    removeNavTab: (
      state: typeof initialState,
      { payload }: PayloadAction<{ navTab: any }>
    ) => {
      state.navTabs = payload.navTab;
    },
    removeTabByLink: (
      state: typeof initialState,
      { payload }: PayloadAction<INavTabs["link"]>
    ) => {
      const allLinksExceptGivenPayload = state.navTabs.filter(
        (d) => !comparePaths(d.link, payload)
      );
      state.navTabs = allLinksExceptGivenPayload;
    },
    removeTabByIds: (
      state: typeof initialState,
      { payload }: PayloadAction<INavTabs["id"][]>
    ) => {
      const idsTORemove = payload || [];
      const filteredTabs = state.navTabs.filter((d) => {
        if (!d.id) return true;
        return !idsTORemove.includes(d.id);
      });
      state.navTabs = filteredTabs;
    },

    addUniqueNavTab: (
      state: typeof initialState,
      { payload }: PayloadAction<INavTabs>
    ) => {
      const isExisting = state.navTabs.find((d) =>
        comparePaths(d.link, payload.link)
      );
      if (!isExisting) {
        state.navTabs.push(payload);
      }
    },
  },
});

export const {
  addNavTab,
  removeNavTab,
  addUniqueNavTab,
  removeTabByIds,
  removeTabByLink,
} = navTabsSlice.actions;

export default navTabsSlice.reducer;
