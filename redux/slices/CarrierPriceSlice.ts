import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import sortBy from "lodash/sortBy";

import { API_REQUEST_HANDLER } from "../../utils/index";
import { Message } from "../../utils/message";
import { sortAlphabetical } from "../../utils/helpers";

export interface Row {
  chargeID: number;
  fromParcel: number;
  baseCost: number;
  incrementStart: number;
  increment: number;
  incrementalCost: number;
}

export interface CostingMatrix {
  rowCount: number;
  rows: Row[];
}

export interface PrimaryCosting {
  baseCost?: number;
  costingMatrix: CostingMatrix;
  packageWeight?: number;
  roundUpWeight?: boolean;
}

export interface EffectiveBetween {
  from: string;
  to: string;
}

export interface Row2 {
  chargeID: number;
  fromParcel: number;
  baseCost: number;
  incrementStart: number;
  increment: number;
  incrementalCost: number;
}

export interface CostingMatrix2 {
  rowCount: number;
  rows: Row2[];
}

export interface SecondaryCosting {
  effectiveFrom: string;
  effectiveBetween: EffectiveBetween;
  baseCost?: number;
  costingMatrix: CostingMatrix2;
}

export interface Contracts {
  reference: string;
  name: string;
}

export interface Costing {
  clientMethodID: number;
  active: boolean;
  pricingMethod: string;
  carrier: string;
  carrierName?: string;
  carrierService: string;
  serviceDescription: string;
  despatchMethod: string;
  methodDescription: string;
  primaryCosting: PrimaryCosting;
  secondaryCosting: SecondaryCosting;
  contracts: string;
}

export interface ICarrierPrice {
  costings: Costing[];
  Successful: boolean;
  Message: string;
}

export interface ICarrierPriceLimit {
  costings: Costing;
  Successful: boolean;
  Message: string;
}

export type DataSecondary = {
  key: number;
  _id: string;
  base_price?: number | null;
  from_weight?: number | null;
  increment_price?: number | null;
  increment_start?: number | null;
  weight_increments?: number | null;
} | null;

type RowData = {
  base_price?: string;
  from_weight?: string;
  increment_price?: string;
  increment_start?: string;
  weight_increments?: string;
};
interface IInitialState {
  carrierPriceList: ICarrierPrice | null;
  carrierPrice: ICarrierPriceLimit | null;
  loader: boolean;
  statusLoader: boolean;
  detailData: any;
  isDetail: boolean;
  selectedData?: number | null;
  isEditing: boolean;
  permanentlyDateData: any;
  tick: boolean;
  secondaryParametersBestPrice: number | string;
  effectiveBetweenDateData: any;
  dataSecondary: any;
  desptachMethodFilter: any;
  carrierFilter: any;
  pricingMethod: any;
  serviceFilter: any;
  mainTableData: any;
  mainTableFixFilter: any;
  ammendData: any;
  editingKey: string;
  editingSecondaryKey: string;
  disableSaveButton: boolean;
  rowData: RowData;
}

const initialState: IInitialState = {
  carrierPriceList: null,
  carrierPrice: null,
  loader: true,
  statusLoader: true,
  detailData: null,
  isDetail: false,
  selectedData: null,
  isEditing: false,
  permanentlyDateData: null,
  tick: false,
  secondaryParametersBestPrice: "",
  effectiveBetweenDateData: null,
  dataSecondary: [],
  desptachMethodFilter: null,
  carrierFilter: [],
  pricingMethod: [],
  serviceFilter: [],
  mainTableData: null,
  mainTableFixFilter: null,
  ammendData: [],
  editingKey: "",
  editingSecondaryKey: "",
  disableSaveButton: false,
  rowData: {},
};

export const fetchCarrierPriceList = createAsyncThunk(
  "fetchCarrierPriceList",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/prices/costings`,
        "get"
      )) as any;

      // return sortedResult;
      const sortedCosting = sortBy(result?.costings, [
        "carrier",
        "contracts",
        "pricingMethod",
        "carrierService",
        "methodDescription",
      ]);

      return { ...result, costings: sortedCosting };
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

export const fetchCarrierPrice = createAsyncThunk(
  "fetchCarrierPrice",
  async (clientMethodId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setStatusLoader(true));
      dispatch(setCarrierPrice(null));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/prices/costing/${clientMethodId}`,
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

export const updateCapacityParcel = createAsyncThunk(
  "updateCapacityParcel",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/prices/costing/single/${data.clientMethodID}`,
        "put",
        data
      )) as any;
      return result;
    } catch (error: any) {
      console.log({ error });
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoader(false));
      return rejectWithValue(error);
    }
  }
);

export const updateCapacityMatrix = createAsyncThunk(
  "updateCapacityMatrix",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/prices/costing/matrix/${data.clientMethodID}`,
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

export const carrierPriceSlice = createSlice({
  name: "carrierPrice",
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
    setIsDetail: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.isDetail = action.payload;
    },
    setDetailData: (state: typeof initialState, action: PayloadAction<any>) => {
      state.detailData = action.payload;
    },
    setSelectedData: (
      state: typeof initialState,
      action: PayloadAction<number | null>
    ) => {
      state.selectedData = action.payload;
    },
    setOnEditing: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.isEditing = action.payload;
    },
    setPermanentlyDateData: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.permanentlyDateData = action.payload;
    },
    setTick: (state: typeof initialState, action: PayloadAction<boolean>) => {
      state.tick = action.payload;
    },
    setSecondaryParamsBestPrice: (
      state: typeof initialState,
      action: PayloadAction<number | string>
    ) => {
      state.secondaryParametersBestPrice = action.payload;
    },
    setEffectiveBetweenDate: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.effectiveBetweenDateData = action.payload;
    },
    setSecondaryData: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.dataSecondary = action.payload;
    },
    setDesptachMethodFilter: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.desptachMethodFilter = action.payload;
    },
    setCarrierFilter: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.carrierFilter = action.payload;
    },
    setPricingMethod: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.pricingMethod = action.payload;
    },
    setServiceFilter: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.serviceFilter = action.payload;
    },
    setMainTableData: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.mainTableData = action.payload;
    },
    setMainTableFixFilter: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.mainTableFixFilter = action.payload;
    },
    setAmmendData: (state: typeof initialState, action: PayloadAction<any>) => {
      state.ammendData = action.payload;
    },
    setEditKey: (state: typeof initialState, action: PayloadAction<any>) => {
      state.editingKey = action.payload;
    },
    setEditSecondaryKey: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.editingSecondaryKey = action.payload;
    },
    setDisableSaveBtn: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.disableSaveButton = action.payload;
    },
    setRowData: (
      state: typeof initialState,
      action: PayloadAction<RowData>
    ) => {
      state.rowData = action.payload;
    },
    setCarrierPrice: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      state.carrierPrice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCarrierPriceList.fulfilled, (state, action) => {
      state.carrierPriceList = action.payload;
      state.loader = false;
    }),
      builder.addCase(fetchCarrierPrice.fulfilled, (state, action) => {
        state.carrierPrice = action.payload;
        state.statusLoader = false;
      });
    builder.addCase(updateCapacityParcel.fulfilled, (state, action) => {
      state.loader = false;
    });
    builder.addCase(updateCapacityMatrix.fulfilled, (state, action) => {
      state.loader = false;
    });
  },
});

export const {
  setLoader,
  setStatusLoader,
  setIsDetail,
  setDetailData,
  setSelectedData,
  setOnEditing,
  setPermanentlyDateData,
  setTick,
  setSecondaryParamsBestPrice,
  setEffectiveBetweenDate,
  setDesptachMethodFilter,
  setCarrierFilter,
  setPricingMethod,
  setServiceFilter,
  setMainTableData,
  setMainTableFixFilter,
  setSecondaryData,
  setAmmendData,
  setEditKey,
  setEditSecondaryKey,
  setDisableSaveBtn,
  setRowData,
  setCarrierPrice,
} = carrierPriceSlice.actions;

export default carrierPriceSlice.reducer;
