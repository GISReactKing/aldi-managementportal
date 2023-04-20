import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { Message } from "../../utils/message";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  userRole: string;
  createdDate: string;
}

export interface IUserList {
  status: number;
  users: User[];
}

interface IInitialState {
  userList: IUserList | null;
  loader: boolean;
}

const initialState: IInitialState = {
  userList: null,
  loader: true,
};

export const fetchUserList = createAsyncThunk(
  "fetchUserList",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/users/activate`,
        "get"
      )) as any;

      return result;
    } catch (error: any) {
      // rejectWithValue(error);
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
      return error;
    }
  }
);

export const userActivation = createAsyncThunk(
  "userActivation",
  async (usernames: object, { dispatch }) => {
    try {
      const user = {
        usernames: usernames,
      };

      console.log({ user });
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        "/api/users/activate",
        "post",
        user
      )) as any;

      if (result.message) Message("success", result.message);

      return result;
    } catch (error: any) {
      // rejectWithValue(error);
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
      return error;
    }
  }
);

export const userActivationSlice = createSlice({
  name: "userActivation",
  initialState,
  reducers: {
    setLoader: (state: typeof initialState, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserList.fulfilled, (state, action) => {
      state.userList = action.payload;
      state.loader = false;
    }),
      builder.addCase(userActivation.fulfilled, (state, action) => {
        state.loader = false;
      });
  },
});

export const { setLoader } = userActivationSlice.actions;

export default userActivationSlice.reducer;
