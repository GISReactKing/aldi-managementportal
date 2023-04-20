import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants/user";
import { Message } from "../../utils/message";
import { CarrierParcelLimit } from "../../pages/carrier-routing-control/carrier-parcel-limits/detailEdit";
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface";
import { CarrierParcelLimitData } from "../../interfaces/carrierParcelLimits";

export interface ClientDespatchMethod {
  Id: number;
  Code: string;
  Description: string;
  CarrierCode: string;
  CarrierDescription: string;
}

export interface Datum {
  Id: number;
  ServiceName: string;
  ServiceDescription: string;
  ClientDespatchMethods: ClientDespatchMethod[];
}

export interface IService {
  code: number;
  data: Datum[];
}

export interface LimitList {
  ID: number;
  IsOverridable: boolean;
  MinValue?: number;
  MaxValue?: number;
  SecondaryMinValue?: any;
  SecondaryMaxValue?: any;
  Type: string;
}

export interface LimitsInfo {
  ServiceID: number;
  PermanentSecondaryDateFrom?: any;
  SecondaryDateFrom?: any;
  SecondaryDateTo?: any;
  LimitList: LimitList[];
}

export interface ClientDespatchMethodList {
  Id: number;
  Code: string;
  Description: string;
  CarrierCode: string;
  CarrierDescription: string;
  LimitsInfo: LimitsInfo;
}

export interface ClientDespatchService {
  Id: number;
  Name: string;
  Description: string;
  ClientDespatchMethods: ClientDespatchMethodList[];
}

export interface DataList {
  ClientDespatchServices: ClientDespatchService[];
}

export interface ICarrierParcelLimitList {
  code: number;
  data: DataList;
}

export interface ServiceLimits {
  ServiceID: number;
  PermanentSecondaryDateFrom?: any;
  SecondaryDateFrom?: any;
  SecondaryDateTo?: any;
  LimitList: LimitList[];
}

export interface DataMethod {
  ServiceLimits: ServiceLimits;
  Successful: boolean;
  Message?: any;
}

export interface IMethod {
  code: number;
  data: DataMethod;
}

export interface TableConfig {
  pagination: TablePaginationConfig;
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<CarrierParcelLimitData>;
}

interface IInitialState {
  services: IService | null;

  allServices: IService | null;
  allServicesExport: IService | null;

  carrierParcelLimitList: ICarrierParcelLimitList | null;
  carrierParcelLimit: IMethod | null;

  loader: boolean;
  statusLoader: boolean;
  serviceLoader: boolean;
  serviceLoaderExport: boolean;
  methodLoader: boolean;
  selectedCarrier: string;
  secondaryParameters: boolean;
  selectedMethod: string;
  allCarrierRecords: boolean;
  pageType: string;
  selectedRowData: CarrierParcelLimit;
  detailData: any;
  location: string;
  selectedId: string | null;
  tableConfig: TableConfig;
  qtyLimit: string[] | null[];
  formEdit: boolean;
  effectiveDate: any;
  effectiveBetweenDates: any;
}

const initialState: IInitialState = {
  services: null,
  allServices: null,
  allServicesExport: null,

  carrierParcelLimitList: null,
  carrierParcelLimit: null,

  loader: false,
  statusLoader: false,
  serviceLoader: false,
  serviceLoaderExport: false,
  methodLoader: false,
  selectedCarrier: "None",
  selectedMethod: "None",
  secondaryParameters: false,
  allCarrierRecords: false,
  pageType: "filter",
  selectedRowData: {} as CarrierParcelLimit,
  detailData: null,
  location: "",
  selectedId: null,
  tableConfig: {} as TableConfig,
  qtyLimit: [null, null, null, null, null],
  formEdit: false,
  effectiveDate: null,
  effectiveBetweenDates: null,
};

export const fetchCarrierServices = createAsyncThunk(
  "fetchCarrierServices",
  async (carrier: string, { dispatch }) => {
    try {
      dispatch(setLoader(true));

      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/services/aldi/carrier/${carrier}`,
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

export const fetchAllServices = createAsyncThunk(
  "fetchAllServices",
  async (_, { dispatch }) => {
    try {
      dispatch(setServiceLoader(true));

      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/services/aldi`,
        "get"
      )) as any;

      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setServiceLoader(false));
    }
  }
);

export const fetchAllServicesExport = createAsyncThunk(
  "fetchAllServicesExport",
  async (_, { dispatch }) => {
    try {
      dispatch(setServiceLoaderExport(true));

      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/services/aldi`,
        "get"
      )) as any;

      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setServiceLoaderExport(false));
    }
  }
);

export const fetchParcelLimitsList = createAsyncThunk(
  "fetchCarrierStatusList",
  async (data: { carrier: string; serviceId: number }, { dispatch }) => {
    try {
      dispatch(setStatusLoader(true));

      console.log(
        `/api/carrier/parcel/limits/service/${data.serviceId}/client/aldi?carrier=${data.carrier}`
      );
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/service/${data.serviceId}/client/aldi?carrier=${data.carrier}`,
        "get"
      )) as any;

      console.log({ result });

      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setStatusLoader(false));
    }
  }
);

export const fetchParcelLimitMethod = createAsyncThunk(
  "fetchParcelLimitMethod",
  async (methodId: number, { dispatch }) => {
    try {
      dispatch(setMethodLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/method/${methodId}`,
        "get"
      )) as any;

      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      dispatch(setMethodLoader(false));
    }
  }
);

export const updateParcelLimits = createAsyncThunk(
  "updateCapacityLimits",
  async (data: { methodId: string; parcelLimit: any }, { dispatch }) => {
    try {
      dispatch(setStatusLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/method/${data.methodId}`,
        "put",
        data.parcelLimit
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      dispatch(setStatusLoader(false));
      return error;
    }
  }
);

export const clearParcelLimits = createAsyncThunk(
  "clearParcelLimits",
  async (data: { methodId: string; parcelLimit: any }, { dispatch }) => {
    try {
      dispatch(setStatusLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/carrier/parcel/limits/method/clear/${data.methodId}`,
        "put",
        { ...data.parcelLimit, Clear: true }
      )) as any;
      return result;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );
      dispatch(setStatusLoader(false));
      return error;
    }
  }
);

export const carrierParcelLimitsSlice = createSlice({
  name: "carrierParcelLimits",
  initialState,
  reducers: {
    clearCarrierParcelLimitsState: () => initialState,
    setLoader: (state: typeof initialState, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    setMethodLoader: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.methodLoader = action.payload;
    },

    setServiceLoader: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.serviceLoader = action.payload;
    },
    setStatusLoader: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.statusLoader = action.payload;
    },
    setServiceLoaderExport: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.serviceLoaderExport = action.payload;
    },
    setSelectedService: (
      state: IInitialState,
      action: PayloadAction<IInitialState["selectedCarrier"]>
    ) => {
      state.selectedCarrier = action.payload;
    },
    setSelectedMethod: (
      state: IInitialState,
      action: PayloadAction<IInitialState["selectedMethod"]>
    ) => {
      state.selectedMethod = action.payload;
    },
    setSelectedRowData: (
      state: IInitialState,
      action: PayloadAction<IInitialState["selectedRowData"]>
    ) => {
      state.selectedRowData = action.payload;
    },
    setDetailData: (
      state: IInitialState,
      action: PayloadAction<IInitialState["detailData"]>
    ) => {
      state.detailData = action.payload;
    },
    setPageType: (
      state: IInitialState,
      action: PayloadAction<IInitialState["pageType"]>
    ) => {
      state.pageType = action.payload;
    },
    setLocation: (
      state: IInitialState,
      action: PayloadAction<IInitialState["location"]>
    ) => {
      state.location = action.payload;
    },
    setSelectedId: (
      state: IInitialState,
      action: PayloadAction<IInitialState["selectedId"]>
    ) => {
      state.selectedId = action.payload;
    },
    setSecondaryParameters: (
      state: IInitialState,
      action: PayloadAction<IInitialState["secondaryParameters"]>
    ) => {
      state.secondaryParameters = action.payload;
    },
    setAllCarrierRecords: (
      state: IInitialState,
      action: PayloadAction<IInitialState["allCarrierRecords"]>
    ) => {
      state.allCarrierRecords = action.payload;
    },
    setTableConfig: (
      state: IInitialState,
      action: PayloadAction<IInitialState["tableConfig"]>
    ) => {
      state.tableConfig = action.payload;
    },
    setQtyLimitData: (
      state: IInitialState,
      action: PayloadAction<IInitialState["qtyLimit"]>
    ) => {
      state.qtyLimit = action.payload;
    },
    setFormEditing: (
      state: IInitialState,
      action: PayloadAction<IInitialState["formEdit"]>
    ) => {
      state.formEdit = action.payload;
    },
    setEffectiveDate: (
      state: IInitialState,
      action: PayloadAction<IInitialState["effectiveDate"]>
    ) => {
      state.effectiveDate = action.payload;
    },
    setEffectiveBetweenDates: (
      state: IInitialState,
      action: PayloadAction<IInitialState["effectiveDate"]>
    ) => {
      state.effectiveBetweenDates = action.payload;
    },
    setCarrierParcelLimit: (
      state: IInitialState,
      action: PayloadAction<IInitialState["carrierParcelLimit"]>
    ) => {
      state.carrierParcelLimit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCarrierServices.fulfilled, (state, action) => {
      state.services = action.payload;
      state.loader = false;
    }),
      builder.addCase(fetchAllServices.fulfilled, (state, action) => {
        state.allServices = action.payload;
        state.serviceLoader = false;
      }),
      builder.addCase(fetchAllServicesExport.fulfilled, (state, action) => {
        state.allServicesExport = action.payload;
        state.serviceLoaderExport = false;
      }),
      builder.addCase(fetchParcelLimitsList.fulfilled, (state, action) => {
        state.carrierParcelLimitList = action.payload;
        state.loader = false;
        state.statusLoader = false;
      }),
      builder.addCase(fetchParcelLimitMethod.fulfilled, (state, action) => {
        state.carrierParcelLimit = action.payload;
        state.methodLoader = false;
      }),
      builder.addCase(updateParcelLimits.fulfilled, (state, action) => {
        state.statusLoader = false;
      });
    builder.addCase(clearParcelLimits.fulfilled, (state, action) => {
      state.statusLoader = false;
    });
  },
});

// Reducers and actions
export const {
  setLoader,
  setPageType,
  setLocation,
  setDetailData,
  setSelectedId,
  setTableConfig,
  setMethodLoader,
  setStatusLoader,
  setServiceLoader,
  setSelectedMethod,
  setSelectedService,
  setSelectedRowData,
  setAllCarrierRecords,
  setSecondaryParameters,
  setServiceLoaderExport,
  setQtyLimitData,
  setFormEditing,
  setEffectiveDate,
  setEffectiveBetweenDates,
  setCarrierParcelLimit,
  clearCarrierParcelLimitsState,
} = carrierParcelLimitsSlice.actions;

export default carrierParcelLimitsSlice.reducer;
