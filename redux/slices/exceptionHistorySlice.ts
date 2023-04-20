import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants/user";
import { stubTrue } from "lodash";
import { Message } from "../../utils/message";

export interface ExceptionHistoryOrder {
  exception: string;
  orderDate: string;
  orderRef: string;
  smartOrder: string;
  status: string;
}

export interface OrdersWithUnknownSKU {
  total: number;
  percentage: string;
}

export interface OrdersWithInactiveSKU {
  total: number;
  percentage: string;
}

export interface OrdersWithNoMatchingDespatchMethod {
  total: number;
  percentage: string;
}

export interface Percentages {
  ["Unknown SKU"]: OrdersWithUnknownSKU;
  ["Inactive SKU"]: OrdersWithInactiveSKU;
  ["No Matching Despatch Method"]: OrdersWithNoMatchingDespatchMethod;
}

export interface ErrorOrder {
  key: string;
  exception: string;
  status: string;
  orderRef: string;
  orderDate: string;
  smartOrder: number;
}

export interface Data {
  data: ErrorOrder[];
  totalOrders: number;
  percentages: Percentages;
}

export interface IExceptionHistoryOrder {
  status: number;
  data: Data;
}

interface IInitialState {
  exceptionHistoryOrder: IExceptionHistoryOrder | null;
  loading: boolean;
}

const initialState: IInitialState = {
  exceptionHistoryOrder: null,
  loading: false,
};

export const fetchExceptionHistoryOrder = createAsyncThunk(
  "fetchExceptionHistoryOrder",
  async ({ client, from, to }: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/exception/history/orders?client=${client}&from=${from}&to=${to}`,
        "get"
      )) as any;
      dispatch(setLoading(false));
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const exceptionHistorySlice = createSlice({
  name: "exceptionHistory",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExceptionHistoryOrder: (
      state,
      action: PayloadAction<IExceptionHistoryOrder | null>
    ) => {
      state.exceptionHistoryOrder = action.payload;
      state.loading = false;
    },
    resetExceptionHistoryState: (state) => {
      state.exceptionHistoryOrder = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExceptionHistoryOrder.fulfilled, (state, action) => {
      state.exceptionHistoryOrder = action.payload.data;
      state.loading = false;
    });
  },
});

export const {
  setLoading,
  setExceptionHistoryOrder,
  resetExceptionHistoryState,
} = exceptionHistorySlice.actions;

export default exceptionHistorySlice.reducer;
