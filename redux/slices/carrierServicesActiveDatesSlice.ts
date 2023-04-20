import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants/user";
import { Message } from "../../utils/message";

export interface EffectiveBetween {
  dateFrom: string;
  dateTo: string;
}

export interface SecondaryParameters {
  active: boolean;
  effectiveBetween: EffectiveBetween;
  effectiveFrom?: string;
}

export interface ClientCarrier {
  carrier: string;
  active: boolean;
  name: string;
  secondaryParameters?: SecondaryParameters;
}

export interface Data {
  clientCarriers: ClientCarrier[];
  Successful: boolean;
  Message: string;
}

export interface ICarrierServicesActive {
  status: number;
  data: Data;
}

export interface DataClientCarrier {
  clientCarrier: ClientCarrier;
  Successful: boolean;
  Message: string;
}

export interface IClientCarrier {
  status: number;
  data: DataClientCarrier;
}

interface IInitialState {
  carrierStatusList: ICarrierServicesActive | null;
  carrierStatus: IClientCarrier | null;
  loader: boolean;
  statusLoader: boolean;
  isEditing: boolean;
  showDetails: boolean;
  permanentlyDateData: string | null;
  effectiveDateRange: (string | null)[] | null;
}

const initialState: IInitialState = {
  carrierStatusList: null,
  carrierStatus: null,
  loader: true,
  statusLoader: true,
  isEditing: false,
  showDetails: false,
  permanentlyDateData: null,
  effectiveDateRange: null,
};

export const fetchCarrierStatusList = createAsyncThunk(
  "fetchCarrierStatusList",
  async (client: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/activeDates/carrier/list?client=${client}`,
        "get"
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
      return rejectWithValue(error);
    }
  }
);

export const fetchCarrierStatus = createAsyncThunk(
  "fetchCarrierStatus",
  async (carrier: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setStatusLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/activeDates/carrier/status/aldi/${carrier}`,
        "get"
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      dispatch(setStatusLoader(false));
      return rejectWithValue(error);
    }
  }
);

export const carrierStatusUpdate = createAsyncThunk(
  "fetchCarrierStatusUpdate",
  async (data: object, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        "/activeDates/carrier/status/update",
        "put",
        data
      )) as any;
      return result.data;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
      return rejectWithValue(error);
    }
  }
);

export const carrierServicesActiveDatesSlice = createSlice({
  name: "carrierServicesActive",
  initialState,
  reducers: {
    setLoader: (state: typeof initialState, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    setStatusLoader: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.statusLoader = action.payload;
    },

    resetCarrierServicesActiveState: (state: typeof initialState) => {
      state.carrierStatusList = null;
      state.carrierStatus = null;
      state.loader = true;
      state.statusLoader = true;
    },

    setEditing: (
      state: typeof initialState,
      action: PayloadAction<IInitialState["isEditing"]>
    ) => {
      state.isEditing = action.payload;
    },
    setShowDetail: (
      state: typeof initialState,
      action: PayloadAction<IInitialState["showDetails"]>
    ) => {
      state.showDetails = action.payload;
    },

    setPermanentlyDateData: (
      state: typeof initialState,
      action: PayloadAction<IInitialState["permanentlyDateData"]>
    ) => {
      state.permanentlyDateData = action.payload;
    },

    setEffectiveDateRange: (
      state: typeof initialState,
      action: PayloadAction<IInitialState["effectiveDateRange"]>
    ) => {
      state.effectiveDateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCarrierStatusList.fulfilled, (state, action) => {
      state.carrierStatusList = action?.payload?.data;
      state.loader = false;
    }),
      builder.addCase(fetchCarrierStatus.fulfilled, (state, action) => {
        state.carrierStatus = action.payload?.data;
        state.statusLoader = false;
      });
    builder.addCase(carrierStatusUpdate.fulfilled, (state, action) => {
      // state.carrierServicesActive = action.payload.data;
      state.loader = false;
    });
  },
});

export const {
  setLoader,
  setEditing,
  setShowDetail,
  setStatusLoader,
  setEffectiveDateRange,
  setPermanentlyDateData,
  resetCarrierServicesActiveState,
} = carrierServicesActiveDatesSlice.actions;

export default carrierServicesActiveDatesSlice.reducer;
