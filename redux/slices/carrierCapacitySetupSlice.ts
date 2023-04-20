import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Moment } from "moment";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { Message } from "../../utils/message";

export interface PrimaryParameters {
  limitCubeM?: any;
  monday?: any;
  tuesday?: any;
  wednesday?: any;
  thursday?: any;
  friday?: any;
  saturday?: any;
  sunday?: any;
}

export interface EffectiveBetween {
  from?: any;
  to?: any;
}

export interface SecondaryParameters {
  effectiveFrom?: any;
  effectiveBetween: EffectiveBetween;
  limitCubeM?: any;
  monday?: any;
  tuesday?: any;
  wednesday?: any;
  thursday?: any;
  friday?: any;
  saturday?: any;
  sunday?: any;
}

export interface CapacityLimitsList {
  carrier: string;
  carrierName: string;
  active: string;
  primaryParameters: PrimaryParameters;
  secondaryParameters: SecondaryParameters;
}

export interface ICapacityLimitsList {
  capacityLimitsList: CapacityLimitsList[];
  Successful: boolean;
  Message: string;
}

export interface ICapacityLimits {
  capacityLimitsList: CapacityLimitsList;
  Successful: boolean;
  Message: string;
}

export interface ICarrierCapacitySetup {
  key?: string;
  sku: string;
  value: string;
  component: string;
  number: string;
}

export type SelectedRow = {
  _id: number;
  carrier: string;
  carrierName: string;
  active: string;
  primary_limit_cube: number;
  primary_parcel_qty_limit: (null | number)[];
  secondary_limit_cube: number;
  secondary_parcel_qty_limit: (null | number)[];
  effective_date: string;
  effective_between_date_from: string;
  effective_between_date_to: string;
};

interface IInitialState {
  capacityLimitsList: any;
  capacityLimits: ICapacityLimits | null;
  loader: boolean;
  statusLoader: boolean;
  isEditing: boolean;
  selectedRow: SelectedRow | null;
  selectedCarrier: string | null;
  effectiveDate: Moment | null;
  effectiveBetweenDates: (Moment | null)[] | null;
  limitCube: string | number | null;
  primaryLimitCube: string | number | null;
  formEdit: boolean;
  qtyLimit: (string | null)[];
}

const initialState: IInitialState = {
  capacityLimitsList: null,
  capacityLimits: null,
  loader: true,
  statusLoader: true,
  isEditing: false,
  selectedRow: null,
  selectedCarrier: null,
  effectiveDate: null,
  effectiveBetweenDates: null,
  limitCube: null,
  primaryLimitCube: null,
  formEdit: false,
  qtyLimit: [null, null, null, null, null, null, null],
};

export const fetchCapacityLimitsList = createAsyncThunk(
  "fetchCarrierStatusList",
  async (client: string, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/capacity/setup/list?client=${client}`,
        "get"
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
    }
  }
);

export const fetchCapacityLimits = createAsyncThunk(
  "fetchCarrierStatus",
  async (data: { client: string; carrier: string }, { dispatch }) => {
    try {
      dispatch(setStatusLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/capacity/setup/carrier?client=${data.client}&carrier=${data.carrier}`,
        "get"
      )) as any;
      dispatch(setLoader(false));
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
    }
  }
);

export const updateCapacityLimits = createAsyncThunk(
  "updateCapacityLimits",
  async (data: object, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        "/api/capacity/setup/carrier",
        "put",
        data
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      dispatch(setLoader(false));
      return error;
    }
  }
);

export const updateCapacityLimitsClear = createAsyncThunk(
  "updateCapacityLimitsClear",
  async (data: object, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        "/api/capacity/setup/carrier/clear",
        "put",
        data
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      dispatch(setLoader(false));
      return error;
    }
  }
);

export const carrierCapacitySetupSlice = createSlice({
  name: "carrierCapacitySetup",
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
    resetCarrierCapacitySetupState: (state: typeof initialState) => {
      state.capacityLimitsList = null;
      state.capacityLimits = null;
      state.loader = true;
      state.statusLoader = true;
    },
    setIsEditing: (
      state: IInitialState,
      action: PayloadAction<IInitialState["isEditing"]>
    ) => {
      state.isEditing = action.payload;
    },
    setSelectedRow: (
      state: IInitialState,
      action: PayloadAction<IInitialState["selectedRow"]>
    ) => {
      state.selectedRow = action.payload;
    },
    setSelectedCarrier: (
      state: IInitialState,
      action: PayloadAction<IInitialState["selectedCarrier"]>
    ) => {
      state.selectedCarrier = action.payload;
    },
    setEffectiveDate: (
      state: IInitialState,
      action: PayloadAction<IInitialState["effectiveDate"]>
    ) => {
      state.effectiveDate = action.payload;
    },

    setEffectiveBetweenDates: (
      state: IInitialState,
      action: PayloadAction<IInitialState["effectiveBetweenDates"]>
    ) => {
      state.effectiveBetweenDates = action.payload;
    },
    setPrimaryLimitCube: (
      state: IInitialState,
      action: PayloadAction<IInitialState["primaryLimitCube"]>
    ) => {
      state.primaryLimitCube = action.payload;
    },
    setLimitCube: (
      state: IInitialState,
      action: PayloadAction<IInitialState["limitCube"]>
    ) => {
      state.limitCube = action.payload;
    },
    setFormEdit: (
      state: IInitialState,
      action: PayloadAction<IInitialState["formEdit"]>
    ) => {
      state.formEdit = action.payload;
    },
    setQtyLimit: (
      state: IInitialState,
      action: PayloadAction<IInitialState["qtyLimit"]>
    ) => {
      state.qtyLimit = action.payload;
    },
    setCapacityLimits: (
      state: IInitialState,
      action: PayloadAction<IInitialState["capacityLimits"]>
    ) => {
      state.capacityLimits = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCapacityLimitsList.fulfilled, (state, action) => {
      state.capacityLimitsList = action.payload;
      state.loader = false;
    }),
      builder.addCase(fetchCapacityLimits.fulfilled, (state, action) => {
        state.capacityLimits = action.payload;
        state.statusLoader = false;
      });
    builder.addCase(updateCapacityLimits.fulfilled, (state, action) => {
      state.loader = false;
    });
    builder.addCase(updateCapacityLimitsClear.fulfilled, (state, action) => {
      state.loader = false;
    });
  },
});

export const {
  setLoader,
  setStatusLoader,
  resetCarrierCapacitySetupState,
  setIsEditing,
  setSelectedRow,
  setSelectedCarrier,
  setEffectiveDate,
  setEffectiveBetweenDates,
  setPrimaryLimitCube,
  setLimitCube,
  setFormEdit,
  setQtyLimit,
  setCapacityLimits,
} = carrierCapacitySetupSlice.actions;

export default carrierCapacitySetupSlice.reducer;
