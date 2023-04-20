import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";
import { API_REQUEST_HANDLER } from "../../utils";
import { Message } from "../../utils/message";

export interface IProductFixedRoutingDespatch {
  key?: string;
  sku_description: string;
  multi_box: string;
  carrier_dispatch: string;
  from_dispatch: string;
  to_dispatch: string;
  includes_dispatch: string;
  carrier_return: string;
  from_return: string;
  to_return: string;
  includes_return: string;
  stock_qty: string;
  kg: string;
  max_dim: string;
  length: string;
  depth: string;
  height: string;
}

export interface ICategories {
  value?: string;
  Id: any;
  ClientDespatchMethodCode: string;
  Type: string;
  Active: boolean;
  Value: string;
  EffectiveDateStart: string;
  EffectiveDateEnd: string;
  created: string;
  creator: string;
}

export interface ISkus {
  code?: string;
  sku?: string;
}

export interface ICategoryDetail {
  code?: string;
  ClientCode?: string;
  ForRegions?: boolean;
  ExistingFixedRouting?: boolean;
}

export interface IServices {
  Id?: string;
  Name?: string;
  ClientDespatchMethods?: string;
  Description?: string;
}

const MockProductFixedRoutingDespatch = [
  {
    key: "1",
    sku_description: "8738945798475243234: aaaaaaaaaaaaaaa",
    multi_box: "N",
    carrier_dispatch: "XDC",
    from_dispatch: "10/03/2022",
    to_dispatch: "22/04/2022",
    includes_dispatch: "",
    carrier_return: "",
    from_return: "12/06/2022",
    to_return: "01/06/2022",
    includes_return: "",
    stock_qty: "99,999",
    kg: "26.00",
    max_dim: "1,400",
    length: "1,400",
    depth: "500",
    height: "900",
  },
  {
    key: "1",
    sku_description: "8738945798475243234: aaaaaaaaaaaaaaa",
    multi_box: "N",
    carrier_dispatch: "XDC",
    from_dispatch: "10/03/2022",
    to_dispatch: "22/04/2022",
    includes_dispatch: "",
    carrier_return: "",
    from_return: "12/06/2022",
    to_return: "01/06/2022",
    includes_return: "",
    stock_qty: "99,999",
    kg: "26.00",
    max_dim: "1,400",
    length: "1,400",
    depth: "500",
    height: "900",
  },
  {
    key: "1",
    sku_description: "8738945798475243234: aaaaaaaaaaaaaaa",
    multi_box: "Y",
    carrier_dispatch: "XDC",
    from_dispatch: "10/03/2022",
    to_dispatch: "22/04/2022",
    includes_dispatch: "",
    carrier_return: "",
    from_return: "12/06/2022",
    to_return: "01/06/2022",
    includes_return: "",
    stock_qty: "99,999",
    kg: "26.00",
    max_dim: "1,400",
    length: "1,400",
    depth: "500",
    height: "900",
  },
  {
    key: "1",
    sku_description: "8738945798475243234: aaaaaaaaaaaaaaa",
    multi_box: "N",
    carrier_dispatch: "Multiple",
    from_dispatch: "10/03/2022",
    to_dispatch: "22/04/2022",
    includes_dispatch: "",
    carrier_return: "",
    from_return: "12/06/2022",
    to_return: "01/06/2022",
    includes_return: "",
    stock_qty: "99,999",
    kg: "26.00",
    max_dim: "1,400",
    length: "1,400",
    depth: "500",
    height: "900",
  },
  {
    key: "1",
    sku_description: "8738945798475243234: aaaaaaaaaaaaaaa",
    multi_box: "N",
    carrier_dispatch: "XDC",
    from_dispatch: "10/03/2022",
    to_dispatch: "22/04/2022",
    includes_dispatch: "",
    carrier_return: "XDC",
    from_return: "12/06/2022",
    to_return: "01/06/2022",
    includes_return: "",
    stock_qty: "99,999",
    kg: "26.00",
    max_dim: "1,400",
    length: "1,400",
    depth: "500",
    height: "900",
  },
];

interface IInitialState {
  despatchState: any;
  detailDespatchState: any;
  data: any;
  skus: any;
  allSkus: ISkus[];
  categories: any;
  categoryLoader: boolean;
  categoryDetail: any;
  categoryDetailLoader: boolean;
  exportCategoryDetail: any;
  services: any;
  carriersServices: any;
  loader: boolean;
}
const initialDespatchState = {
  isProductFixedRoute: false,
  selectedSku: "",
  selectedSkuDescription: "",
  skuList: [],
  selectedSkus: [],
  showModal: false,
  disableSelectSku: false,
  popUpShow: false,
  selectedFromList: [],
  formData: {
    category: null,
    show_products_fixed: false,
    include_skus_fixed: false,
  },
  productFixedRouting: {},
  skuFilterList: [],
  customPreferenceIDs: [],
};

const initialDetailDespatchState = {
  pageLoaderFirstTime: true,
  despatchDateRange: [],
  clientDespatchServiceIDs: [],
  clientDespatchMethodIDs: [],
  filterData: {
    service: 0,
    method: "none",
    methodName: "",
    serviceName: "",
    carrier: "none",
    includes: [] as any,
    customPreferenceIDs: [] as any,
    startDate: null,
    endDate: null,
  },
  confirmProductFixedRoutingList: [] as any,
  allCarriers: [],
  selectedMethods: [],
  tableData: [],
  categoryDetailData: [],
  scrollTop: 0,
};

const initialState: IInitialState = {
  despatchState: initialDespatchState,
  detailDespatchState: initialDetailDespatchState,
  data: [] as IProductFixedRoutingDespatch[],
  skus: [] as ISkus[],
  allSkus: [] as ISkus[],
  categories: [] as ICategories[],
  categoryLoader: true,
  categoryDetail: [] as ICategoryDetail[],
  categoryDetailLoader: true,
  exportCategoryDetail: [] as ICategoryDetail[],
  services: [] as IServices,
  carriersServices: [],
  loader: false,
};

export const fetchProductFixedRoutingDespatch = createAsyncThunk(
  "fetchProductFixedRoutingDespatch",
  () => {
    return MockProductFixedRoutingDespatch;
  }
);

export const fetchCategories = createAsyncThunk(
  "fetchCategories",
  async (_, { dispatch }) => {
    dispatch(setCategoryLoader(true));
    return (await API_REQUEST_HANDLER(
      "/productFixedRouting/categories?client=ALDI",
      "get"
    )) as any;
  }
);

export const fetchCategoryDetail = createAsyncThunk(
  "fetchCategoryDetail",
  async (data: any, { dispatch }) => {
    dispatch(setCategoryDetailLoader(true));
    const result = (await API_REQUEST_HANDLER(
      "/productFixedRouting/categoryDetail/v2?sortedBy=description",
      "post",
      data
    )) as any;
    return result;
  }
);

export const fetchExportCategoryDetail = createAsyncThunk(
  "fetchExportCategoryDetail",
  async (data: any, { rejectWithValue }) => {
    try {
      console.log("fetchExportCategoryDetail", data);
      console.log({ fetchExportCategoryDetail: data });
      const result = (await API_REQUEST_HANDLER(
        "/productFixedRouting/categoryDetail/export/v2?client=ALDI&sortedBy=code",
        "post",
        data
      )) as any;
      console.log({ fetchExportCategoryDetail: result });
      return result;
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const addCategoryDetail = createAsyncThunk(
  "addCategoryDetail",
  async (data: any, { rejectWithValue }) => {
    try {
      console.log({ addCategoryDetail: data });
      const result = (await API_REQUEST_HANDLER(
        "/productFixedRouting/categoryDetails/v2",
        "post",
        data
      )) as any;
      console.log({ addCategoryDetail: result });
      Message("success", "Data added successfully.");
      return result;
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const updateCategoryDetail = createAsyncThunk(
  "updateCategoryDetail",
  async (data: any, { rejectWithValue }) => {
    try {
      console.log({ updateCategoryDetail: data });
      const result = (await API_REQUEST_HANDLER(
        "/productFixedRouting/categoryDetail/v2",
        "put",
        data
      )) as any;
      console.log({ updateCategoryDetail: result });
      Message("success", "Data updated successfully.");
      return result;
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const deleteCategoryDetail = createAsyncThunk(
  "deleteCategoryDetail",
  async (customPreferenceIDs: number[], { rejectWithValue }) => {
    try {
      console.log({ customPreferenceIDs });
      const result = (await API_REQUEST_HANDLER(
        "/productFixedRouting/deleteCategoryDetails/v2",
        "delete",
        { customPreferenceList: customPreferenceIDs }
      )) as any;
      Message("success", "Data deleted successfully.");
      return result;
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const fetchAllSkus = createAsyncThunk(
  "fetchAllSkus",
  async ({ code, ForRegions = true }: any, { dispatch }) => {
    return (await API_REQUEST_HANDLER(
      `/productFixedRouting/sku/list/v2?code=${code}&client=ALDI&ForRegions=${ForRegions}`,
      "get"
    )) as any;
  }
);

export const fetchSkus = createAsyncThunk(
  "fetchSkus",
  async ({ code, ForRegions, source }: any, { dispatch }) => {
    dispatch(setLoader(true));
    try {
      const token = source?.token
        ? {
            cancelToken: source.token,
          }
        : undefined;

      const data = (await API_REQUEST_HANDLER(
        `/productFixedRouting/sku/list/v2?code=${code}&client=ALDI&ForRegions=${ForRegions}`,
        "get",
        undefined,
        undefined,
        token
      )) as any;
      dispatch(setLoader(false));
      return data;
    } catch (e) {
      if (!axios.isCancel(e)) dispatch(setLoader(false));
      throw e;
    }
  }
);

export const fetchServices = createAsyncThunk("fetchServices", async () => {
  const result = (await API_REQUEST_HANDLER(
    `/productFixedRouting/services`,
    "post"
  )) as any;
  console.log({ fetchServices: result });
  return result;
});

export const fetchCarriersServices = createAsyncThunk(
  "fetchCarriersServices",
  async () => {
    const result = (await API_REQUEST_HANDLER(
      // `/productFixedRouting/servicesCarriersMethods`,
      `/productFixedRouting/carrier/services?client=aldi`,
      "get"
    )) as any;
    console.log({ fetchCarriersServices: result });
    return result;
  }
);

export const fetchCarrierStatus = createAsyncThunk(
  "fetchCarrierStatus",
  async (carrier: string, { dispatch, rejectWithValue }) => {
    try {
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
      return rejectWithValue(error);
    }
  }
);

export const productFixedRoutingDespatchSlice = createSlice({
  name: "ProductFixedRoutingDespatch",
  initialState,
  reducers: {
    setPageProps: (state: typeof initialState, action: PayloadAction<any>) => {
      state.despatchState = {
        ...state.despatchState,
        ...action.payload,
      };
    },
    setDetailPageProps: (
      state: typeof initialState,
      action: PayloadAction<any>
    ) => {
      console.log({ PayloadAction: action.payload });
      state.detailDespatchState = {
        ...state.detailDespatchState,
        pageLoaderFirstTime: false,
        ...action.payload,
      };
    },
    setInitialDetailPageProps: (state: typeof initialState) => {
      state.detailDespatchState = {
        ...initialDetailDespatchState,
      };
      state.despatchState = {
        ...state.despatchState,
        productFixedRouting: {},
        customPreferenceIDs: [],
      };
    },
    clearCategoryDetail: (state: typeof initialState) => {
      state.categoryDetail = [];
    },
    setLoader: (state: typeof initialState, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    resetProductFixedRoutingDespatchState: (state: typeof initialState) => {
      state.despatchState = initialDespatchState;
      state.detailDespatchState = initialDetailDespatchState;
      state.data = [];
      state.skus = [];
      state.categories = [];
      state.categoryLoader = true;
      state.categoryDetail = [];
      state.categoryDetailLoader = true;
      state.exportCategoryDetail = [];
      state.services = [];
      state.carriersServices = [];
      state.loader = false;
    },
    setCategoryLoader: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.categoryLoader = action.payload;
    },
    setCategoryDetailLoader: (
      state: typeof initialState,
      action: PayloadAction<boolean>
    ) => {
      state.categoryDetail = [];
      state.categoryDetailLoader = action.payload;
    },

    setCategoryDetailData: (
      state: typeof initialState,
      action: PayloadAction<any[]>
    ) => {
      state.detailDespatchState.categoryDetailData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchProductFixedRoutingDespatch.fulfilled,
      (state, action) => {
        state.data = action.payload;
      }
    ),
      builder.addCase(fetchSkus.fulfilled, (state, action) => {
        state.skus = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.loader = false;
      }),
      builder.addCase(fetchSkus.rejected, (state) => {
        state.skus = [];
      }),
      builder.addCase(fetchAllSkus.fulfilled, (state, action) => {
        state.allSkus = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.loader = false;
      }),
      builder.addCase(fetchAllSkus.rejected, (state) => {
        state.allSkus = [];
        state.loader = false;
      }),
      builder.addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
        state.categoryLoader = false;
      }),
      builder.addCase(fetchCategoryDetail.fulfilled, (state, action) => {
        console.log(
          "action.payload.data fetchCategoryDetail",
          action.payload?.data
        );
        let arr = Array.isArray(action.payload?.data)
          ? action.payload?.data
          : [];
        if (state.despatchState?.formData?.show_products_fixed) {
          let newArr = arr?.filter((d: any) =>
            d?.RegionList?.length > 0 && d?.CarrierCode?.trim()?.length > 0
              ? true
              : d?.CarrierCode?.trim()?.length > 0
          );
          state.categoryDetail = newArr || [];
        } else {
          state.categoryDetail = arr || [];
        }
        state.categoryDetailLoader = false;
      }),
      builder.addCase(fetchExportCategoryDetail.fulfilled, (state, action) => {
        state.exportCategoryDetail = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      }),
      builder.addCase(addCategoryDetail.fulfilled, (state, action) => {
        console.log({ addCategoryDetail: action.payload });
      }),
      builder.addCase(updateCategoryDetail.fulfilled, (state, action) => {
        console.log({ updateCategoryDetail: action.payload });
      }),
      builder.addCase(fetchServices.fulfilled, (state, action) => {
        state.services = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      });
    builder.addCase(fetchCarriersServices.fulfilled, (state, action) => {
      state.carriersServices = action?.payload?.data || [];
    });
  },
});

export const {
  setPageProps,
  setDetailPageProps,
  setInitialDetailPageProps,
  clearCategoryDetail,
  setLoader,
  setCategoryLoader,
  setCategoryDetailLoader,
  resetProductFixedRoutingDespatchState,
  setCategoryDetailData,
} = productFixedRoutingDespatchSlice.actions;

export default productFixedRoutingDespatchSlice.reducer;
