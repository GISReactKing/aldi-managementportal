import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_THEME } from "../../constants";

export interface IClient {
  _id?: string;
  code: string;
  name: string;
  created_on?: string;
}

interface ThemeInitialState {
  theme: {
    lightBlue: string;
    mono: string;
    offWhite: string;
    primary: string;
    primaryNight: string;
    black: string;
    gray: string;
    peach: string;
    darkBlue: string;
    monoInput: string;
    primarySea: string;
    secondaryFire: string;
    monoLabel: string;
    monoGray: string;
    monoTagSuccess: string;
    monoTitle: string;
    successBorder: string;
    monoLightTitle: string;
    monoPlaceholder: string;
    monoBorder: string;
    monoLightGray: string;
    white: string;
    lightGray: string;
    primaryNightHorizontal: string;
    orange: string;
    btnLoaderColor: string;
    disabledGray: string;
  };
  isInitialized: boolean;
}

const initialState: ThemeInitialState = {
  theme: DEFAULT_THEME,
  isInitialized: false,
};

const syncCssTheme = (theme: (typeof initialState)["theme"]) => {
  const root = document.documentElement;
  root?.style.setProperty("--light-blue", theme.lightBlue);
  root?.style.setProperty("--mono", theme.mono);
  root?.style.setProperty("--off-white", theme.offWhite);
  root?.style.setProperty("--primary", theme.primary);
  root?.style.setProperty("--primary-night", theme.primaryNight);
  root?.style.setProperty(
    "--primary-night-horizontal",
    theme.primaryNightHorizontal
  );
  root?.style.setProperty("--gray", theme.gray);
  root?.style.setProperty("--peach", theme.peach);
  root?.style.setProperty("--dark-blue", theme.darkBlue);
  root?.style.setProperty("--mono-input", theme.monoInput);
  root?.style.setProperty("--primary-sea", theme.primarySea);
  root?.style.setProperty("--secondary-fire", theme.secondaryFire);
  root?.style.setProperty("--mono-label", theme.monoLabel);
  root?.style.setProperty("--mono-gray", theme.monoGray);
  root?.style.setProperty("--mono-tag-success", theme.monoTagSuccess);
  root?.style.setProperty("--mono-title", theme.monoTitle);
  root?.style.setProperty("--success-border", theme.successBorder);
  root?.style.setProperty("--mono-light-title", theme.monoLightTitle);
  root?.style.setProperty("--mono-placeholder", theme.monoPlaceholder);
  root?.style.setProperty("--mono-border", theme.monoBorder);
  root?.style.setProperty("--mono-light-gray", theme.monoLightGray);
  root?.style.setProperty("--white", theme.white);
  root?.style.setProperty("--light-gray", theme.lightGray);
  root?.style.setProperty("--orange", theme.orange);
  root?.style.setProperty("--btn-loader-color", theme.btnLoaderColor);
  root?.style.setProperty("--disabled-gray", theme.disabledGray);
};

const initializeThemeAction = (state: typeof initialState) => {
  const isInitialized = state.isInitialized;
  const theme = state?.theme || DEFAULT_THEME;
  if (!isInitialized) {
    state.theme = DEFAULT_THEME;
    state.isInitialized = true;
  }
  syncCssTheme(theme);
};

const updateThemeFunc = (state: typeof initialState, action: any) => {
  const theme = state?.theme || DEFAULT_THEME;
  const newTheme = action.payload || theme;
  state.theme = newTheme;
  syncCssTheme(newTheme);
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initializeTheme: initializeThemeAction,
    updateTheme: updateThemeFunc,
  },
});

export const { initializeTheme, updateTheme } = themeSlice.actions;

export default themeSlice.reducer;
