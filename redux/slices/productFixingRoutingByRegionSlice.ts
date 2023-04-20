import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";
import _ from "lodash";

export interface IByRegion {
  _id: string;
  code: string;
  sku: string;
  carrier: string;
  despatch_Return: string;
  date_from: string;
  date_to: string;
}

interface IInitialState {
  byRegionDespatchState: any;
  loader: boolean;
  fullListloader: boolean;
  byRegion: any | [];
  postCodeRegion: any | [];
  carriers: any | [];
  skuDetails: any | [];
  skuDetailsLoader: boolean;
  skus: any | [];
  skusList: any | [];
  skusRegionList: any | [];
  enableSave: boolean;
  filterData: {
    service: string;
    method: string;
    carrier: string;
    includes: any[];
    startDate?: any;
    endDate?: any;
    regionList?: any;
    despatch: string;
  };
  skuDescription: string;
  popUpShow: boolean;
  selectedMethods: any[];
  isLoading: boolean;
  data: any[];
  validated: boolean;
  show: boolean;
  skuFilterList: any[];
  selectedSku: string;
  despatchDateRange: any[];
  removeItemIDs: any[];
  customPreferenceIDs: any[];
  carrierStatusLoader: boolean;
  error: string;
  showRangePicker: any[];
}

const byRegionDespatchInitialState = {
  dataLoaded: false,
  isPageLoaded: false,
  fullListLoaded: false,
  skuDescription: "",
  popUpShow: false,
  selectedMethods: [],
  isLoading: false,
  filterData: {
    service: "none",
    method: "none",
    carrier: "none",
    includes: [],
    startDate: null,
    endDate: null,
    regionList: null,
    despatch: "Despatch",
  },
  data: [],
  show: false,
  skuFilterList: [],
  selectedSku: "",
  despatchDateRange: [],
  removeItemIDs: [],
  customPreferenceIDs: [],
  serviceName: "",
  methodName: "",
  error: "",
  allCarriers: [],
};

const initialState: IInitialState = {
  byRegionDespatchState: byRegionDespatchInitialState,
  loader: true,
  fullListloader: true,
  byRegion: [],
  postCodeRegion: [],
  carriers: [],
  skuDetails: [],
  skuDetailsLoader: false,
  skus: [],
  skusList: [],
  skusRegionList: [],
  enableSave: false,
  filterData: {
    service: "none",
    method: "none",
    carrier: "none",
    includes: [],
    startDate: null,
    endDate: null,
    regionList: null,
    despatch: "Despatch",
  },
  skuDescription: "",
  selectedMethods: [],
  isLoading: false,
  popUpShow: false,
  data: [],
  validated: false,
  show: false,
  skuFilterList: [],
  selectedSku: "",
  despatchDateRange: [],
  removeItemIDs: [],
  customPreferenceIDs: [],
  carrierStatusLoader: false,
  error: "",
  showRangePicker: [],
};

export const fetchPostCodeRegion = createAsyncThunk(
  "fetchPostCodeRegion",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/productFixedRoutingByRegion/getAllRegions`,
        "get"
      )) as any;
      return result?.data?.Regions;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCarriers = createAsyncThunk(
  "fetchCarriers",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const result = (await API_REQUEST_HANDLER(
        `/invoice/carrier?client=ALDI`,
        "get"
      )) as any;
      return result;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchSkuDetails = createAsyncThunk(
  "fetchSkuDetails",
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setSkuDetailLoading(true));
      const result = (await API_REQUEST_HANDLER(
        `/productFixedRoutingByRegion/getSkuDetailsv2`,
        "post",
        data
      )) as any;
      return result;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setSkuDetailLoading(false));
    }
  }
);

export const fetchSkus = createAsyncThunk(
  "fetchSkus",
  async ({ sku }: any, { rejectWithValue, dispatch }) => {
    try {
      return (await API_REQUEST_HANDLER(
        `/productFixedRoutingByRegion/sku/list?sku=${sku}`,
        "get"
      )) as any;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSkusFilterList = createAsyncThunk(
  "fetchSkusFilterList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log(
        "🚀 ~ file: productFixingRoutingByRegionSlice.ts ~ line 105 ~ fetchSkusFilterList",
        fetchSkusFilterList
      );
      dispatch(setLoading(true));
      return (await API_REQUEST_HANDLER(
        `/productFixedRoutingByRegion/sku/list?client=aldi`,
        "get"
      )) as any;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchSkusWithRegions = createAsyncThunk(
  "fetchSkusWithRegions",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setFullListLoading(true));
      return (await API_REQUEST_HANDLER(
        `/productFixedRoutingByRegion/getSkusWithRegionsv2?client=aldi`,
        "get"
      )) as any;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(setFullListLoading(false));
    }
  }
);

export const productFixingRoutingByRegionSlice = createSlice({
  name: "productFixingRoutingByRegion",
  initialState,
  reducers: {
    setPageProps: (state: typeof initialState, action: PayloadAction<any>) => {
      state.byRegionDespatchState = {
        ...state.byRegionDespatchState,
        ...action.payload,
      };
    },

    setReduxState: (
      state,
      action: PayloadAction<{ key: string; value: any }>
    ) => {
      const key = action.payload.key;
      // @ts-ignore: Unreachable code error
      state[key] = action.payload.value;
    },
    fetchProductFixedRoutingByRegion: (state: typeof initialState) => {
      // state.byRegion = MockByRegion;
    },
    setLoading: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.loader = action.payload;
    },
    setSkuDetailLoading: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.skuDetailsLoader = action.payload;
    },
    clearSkuList: (state: typeof initialState) => {
      state.skuDetails = [];
    },
    setFullListLoading: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.fullListloader = action.payload;
      if (action.payload) {
        state.skusRegionList = [];
      }
    },
    resetState: (state: typeof initialState) => {
      state.loader = true;
      state.fullListloader = true;
      state.byRegion = [];
      state.postCodeRegion = [];
      state.carriers = [];
      state.skuDetails = [];
      state.skus = [];
      state.skusList = [];
      state.skusRegionList = [];
      state.byRegionDespatchState = byRegionDespatchInitialState;
    },
    setEnableSave: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.enableSave = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPostCodeRegion.fulfilled, (state, action) => {
      // To Do - after edit user api will be ready
      if (action.payload?.length) {
        const regionList = action.payload.map((item: any) => {
          return {
            id: item.RegionID,
            code: item.RegionName,
            name: item.RegionName,
          };
        });
        state.postCodeRegion = [...regionList];
      }
    }),
      builder.addCase(fetchCarriers.fulfilled, (state, action) => {
        // To Do - after edit user api will be ready
        state.carriers = [...action.payload.data];
      }),
      builder.addCase(fetchSkuDetails.fulfilled, (state, action) => {
        // To Do - after edit user api will be ready
        state.skuDetails = [...action.payload.data];
        // state.skuDetailsLoader = false;
      }),
      builder.addCase(fetchSkus.fulfilled, (state, action) => {
        state.skus = action.payload.data;
      });
    builder.addCase(fetchSkusFilterList.fulfilled, (state, action) => {
      if (action.payload?.data?.rows?.length) {
        const arr = action.payload?.data?.rows;
        let sortedList = arr?.map((d: any) => ({
          ...d,
          Item_Description: d?.Item_Description?.trim(),
        }));

        let skusListData = _.sortBy(sortedList, [
          (list) => list?.Item_Description?.toLowerCase(),
        ]);
        state.skusList = skusListData;
      }
    });
    builder.addCase(fetchSkusWithRegions.fulfilled, (state, action) => {
      if (action.payload?.data?.length) {
        const skusRegionList = _.sortBy(action.payload.data, [
          "Code",
          "RegionListName",
        ]);
        state.skusRegionList = skusRegionList;
      }
    });
  },
});

// Selectors
// export const getUser = (state: any) => state.users;

// Reducers and actions
export const {
  setPageProps,
  fetchProductFixedRoutingByRegion,
  setLoading,
  setSkuDetailLoading,
  setFullListLoading,
  resetState,
  clearSkuList,
  setEnableSave,
  setReduxState,
} = productFixingRoutingByRegionSlice.actions;

export default productFixingRoutingByRegionSlice.reducer;
