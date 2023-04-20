import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IExceptionSkuListData,
  IExceptionSkuListRow,
  IRequest,
  ISameCarrierKitFlagResponse,
  ISkuListRow,
  IFetchConfigurationResponse,
} from "../types/multi-box";
import { Message } from "../../utils/message";
import { API_REQUEST_HANDLER } from "../../utils";
import _ from "lodash";
export interface IMultiBoxProductRouting {
  key?: string;
  sku: string;
  value: string;
  component: string;
}

export interface IMultiBoxProductRoutingGrid {
  key?: string;
  sku: string;
  value: string;
  component: string;
  number: string;
}

interface IInitialState {
  sameKitCarrier: boolean;
  multiBoxSkuList: ISkuListRow[];
  multiBoxExceptionSkus: ISkuListRow[];
  componentExceptionSkus: IExceptionSkuListRow[];
  loading: boolean;
  sameKitCarrierValue: string;
}

const initialState: IInitialState = {
  sameKitCarrier: false,
  sameKitCarrierValue: "",
  multiBoxSkuList: [],
  multiBoxExceptionSkus: [],
  componentExceptionSkus: [],
  loading: false,
};

export const fetchMultiBoxRoutingConfiguration = createAsyncThunk<
  IFetchConfigurationResponse,
  IRequest,
  {
    rejectValue: any;
  }
>(
  "fetchMultiBoxRoutingConfiguration",
  async ({ client }, { rejectWithValue, dispatch }) => {
    try {
      console.log("fetchMultiBoxRoutingConfiguration", { client });
      dispatch(setLoading(true));
      const result = (await API_REQUEST_HANDLER(
        `/multibox?client=${client}`,
        "get"
      )) as any;

      return result.data;
    } catch (error) {
      console.log("fetchMultiBoxRoutingConfiguration", { error });
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const configureMultiBoxRouting = createAsyncThunk<
  void,
  IRequest,
  {
    rejectValue: any;
  }
>(
  "configureMultiBoxRouting",
  async (
    { client, sameCarrier, skuListToAdd, skuListToRemove },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      const data = { client, sameCarrier, skuListToAdd, skuListToRemove };
      const result: ISameCarrierKitFlagResponse = (await API_REQUEST_HANDLER(
        `/multibox`,
        "post",
        data
      )) as any;

      // const message = result.data.rows[2].Success;

      // Message("success", "The changes have been saved successfully");
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchMultiBoxExceptionSkus = createAsyncThunk<
  IExceptionSkuListData,
  IRequest,
  {
    rejectValue: any;
  }
>(
  "fetchMultiBoxExceptionSkus",
  async ({ client }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const result = (await API_REQUEST_HANDLER(
        `/multibox/component/exceptions?client=${client}`,
        "get"
      )) as any;

      return result.data;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const multiBoxProductRoutingSlice = createSlice({
  name: "multiBoxProductRouting",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetMultiBoxState: (state) => {
      state.sameKitCarrier = false;
      state.sameKitCarrierValue = "";
      state.multiBoxSkuList = [];
      state.multiBoxExceptionSkus = [];
      state.componentExceptionSkus = [];
      state.loading = false;

      console.log("resetMultiBoxState", { state });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchMultiBoxRoutingConfiguration.fulfilled,
      (state, action) => {
        const { clientDefault, items } = action.payload;

        // get sku items
        const { rows } = items;

        state.sameKitCarrier =
          action.payload?.clientDefault?.Same_Kit_Carrier_Default === "Y";
        state.sameKitCarrierValue =
          action.payload?.clientDefault.Same_Kit_Carrier_Default;
        let multiBoxSkuList = action.payload?.items?.rows.filter(
          (row) =>
            row.Same_Kit_Carrier === clientDefault.Same_Kit_Carrier_Default
        );
        multiBoxSkuList = _.sortBy(multiBoxSkuList, "Item_Description");
        state.multiBoxSkuList = multiBoxSkuList;

        state.multiBoxExceptionSkus = action.payload?.items?.rows.filter(
          (row) =>
            row.Same_Kit_Carrier !== clientDefault.Same_Kit_Carrier_Default
        );
      }
    );
    builder.addCase(fetchMultiBoxExceptionSkus.fulfilled, (state, action) => {
      state.componentExceptionSkus = Array.isArray(action.payload.rows)
        ? [...action.payload.rows]
        : [];
    });
    builder.addCase(configureMultiBoxRouting.fulfilled, (state, action) => {});
  },
});

export const { setLoading, resetMultiBoxState } =
  multiBoxProductRoutingSlice.actions;

export default multiBoxProductRoutingSlice.reducer;
