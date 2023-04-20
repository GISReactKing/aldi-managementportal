import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils";
import { Message } from "../../utils/message";
import { fetchClientList } from "./clientSlice";
import { updateRolesPaginationEntityCount } from "./newRolesAndPermissionSlice";

export interface ICarrier {
  id: number;
  code: string;
  name: string;
}
export interface ISummary {
  _id: string;
  summaryID: number;
  created: string;
  filename: string;
  invoiceNumber: string;
  status: string;
  carrier: string;
  contract: string;
  consignmentsCount: number;
  internalCost: number;
  invoicedCost: number;
  match: string;
  creator: string;
  accept: boolean;
  reason: string;
  reject: boolean;
}

export interface ISummaryDetail {
  _id: string;
  summaryID: number;
  detailsID: number;
  date: string;
  status: string;
  client: string;
  service: string;
  consignmentNo: string;
  orderReference: string;
  parcelCount: number;
  baseCost: number;
  baseSurcharge: number;
  totalCost: number;
  adjustedCost: number;
  adjustedSurcharge: number;
  adjustedTotal: number;
  displayCost: number;
  displaySurcharge: number;
  displayTotal: number;
  invoicedCost: number;
  invoicedSurcharge: number;
  invoicedTotal: number;
  combinedCost: object;
  combinedSurcharge: object;
  difference: number;
  creator: string;
  created: string;
}

export interface ISummaryDetailExport {
  _id: string;
  summaryID: number;
  detailsID: number;
  date: string;
  status: string;
  client: string;
  service: string;
  consignmentNo: string;
  orderReference: string;
  parcelCount: number;
  baseCost: number;
  baseSurcharge: number;
  totalCost: number;
  adjustedCost: number;
  adjustedSurcharge: number;
  adjustedTotal: number;
  displayCost: number;
  displaySurcharge: number;
  displayTotal: number;
  invoicedCost: number;
  invoicedSurcharge: number;
  invoicedTotal: number;
  combinedCost: object;
  combinedSurcharge: object;
  difference: number;
  creator: string;
  created: string;
}

const mockData = [
  {
    _id: "61d28137070fa4fca101a27c",
    summaryID: 80162,
    created: "2022-01-03T04:53:11.000Z",
    filename: "CRR-Test-02.xlsb",
    invoiceNumber: "INVOICE001",
    status: "Accepted",
    carrier: "YODEL",
    contract: "9640398",
    consignmentsCount: 3,
    internalCost: 7.2,
    invoicedCost: 7.2,
    match: "100.00%",
    creator: "6199ff3ba19f334325693568",
    accept: true,
    reason: "Testing",
    reject: false,
  },
  {
    _id: "61d28137070fa4fca101a27c",
    summaryID: 80162,
    created: "2022-01-03T04:53:11.000Z",
    filename: "CRR-Test-02.xlsb",
    invoiceNumber: "INVOICE001",
    status: "Accepted",
    carrier: "YODEL",
    contract: "9640398",
    consignmentsCount: 3,
    internalCost: 7.2,
    invoicedCost: 7.2,
    match: "100.00%",
    creator: "6199ff3ba19f334325693568",
    accept: true,
    reason: "Testing",
    reject: false,
  },
  {
    _id: "61d28137070fa4fca101a27c",
    summaryID: 80162,
    created: "2022-01-03T04:53:11.000Z",
    filename: "CRR-Test-02.xlsb",
    invoiceNumber: "INVOICE001",
    status: "Accepted",
    carrier: "YODEL",
    contract: "9640398",
    consignmentsCount: 3,
    internalCost: 7.2,
    invoicedCost: 7.2,
    match: "100.00%",
    creator: "6199ff3ba19f334325693568",
    accept: true,
    reason: "Testing",
    reject: false,
  },
];

interface IInitialState {
  loader: boolean;
  detailLoader: boolean;
  summaryInvoice: ISummary[];
  summaryInvoiceDetail: ISummaryDetail[];
  summaryInvoiceDetailExport: ISummaryDetailExport[];
  sourceData: { [id: string]: ISummaryDetail[] };
  totalSummary: number;
  totalSummaryDetail: number;
  summaryID: null | number;
  summaryStatus: null | string;
  filename: null | string;
  invoiceNumber: null | string;
  carrierName: null | string;
  carrierList: ICarrier[];
  paginationEntityCount: any;
  detailPaginationEntityCount: any;
  totalCarrier: number | null;
  loadingImport: boolean;
}

const initialState: IInitialState = {
  loader: true,
  detailLoader: true,
  summaryInvoice: [] as ISummary[],
  summaryInvoiceDetail: [] as ISummaryDetail[],
  summaryInvoiceDetailExport: [] as ISummaryDetailExport[],
  totalSummary: 0,
  totalSummaryDetail: 0,
  summaryID: null,
  summaryStatus: null,
  filename: null,
  invoiceNumber: null,
  carrierName: null,
  carrierList: [] as ICarrier[],
  paginationEntityCount: 10,
  detailPaginationEntityCount: 10,
  totalCarrier: null,
  loadingImport: true,
  sourceData: {},
};

export const fetchCarrierList = createAsyncThunk(
  "fetchCarrierList",
  async ({ client }: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice/carrier?client=${client}`,
        "get"
      )) as any;
      return result;
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const fetchInvoiceSummary = createAsyncThunk(
  "fetchInvoiceSummary",
  async ({ page, limit, username }: any, { dispatch }) => {
    dispatch(setLoader(true));
    const result = (await API_REQUEST_HANDLER(
      `/invoice/summary?page=${page}&limit=${limit}&desc=true&username=${username}`,
      "get"
    )) as any;
    dispatch(setLoader(false));

    return result;
  }
);

export const filterInvoiceSummary = createAsyncThunk(
  "filterInvoiceSummary",
  async ({ page, limit, username, sort, desc, search, from, to }: any) => {
    const result = (await API_REQUEST_HANDLER(
      `/invoice/summary?page=${page}&limit=${limit}&username=${username}&sort=${sort}&desc=${desc}&search=${search}&filterFrom=${from}&filterTo=${to}`,
      "get"
    )) as any;
    return result;
  }
);

export const acceptRejectInvoiceSummary = createAsyncThunk(
  "acceptRejectInvoiceSummary",
  async (
    { summary, summaryID, reason, username }: any,
    { rejectWithValue }
  ) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice/summary/${summary}?summaryID=${summaryID}&reason=${reason}&username=${username}`,
        "put"
      )) as any;
      console.log({ result: result.code, true: result.code !== 200 });
      if (!result || (result?.code && result.code != 200)) {
        Message(
          "danger",
          result?.message ? result?.message : "Something went wrong"
        );
        return true;
      } else {
        Message("success", result.message);
        return result;
      }
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const deleteInvoiceSummary = createAsyncThunk(
  "deleteInvoiceSummary",
  async ({ summaryID, username }: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice/summary?id=${summaryID}&username=${username}`,
        "delete"
      )) as any;
      console.log({ result: result.code, true: result.code !== 200 });
      if (!result || (result?.code && result.code != 200)) {
        Message(
          "danger",
          result?.message ? result?.message : "Something went wrong"
        );
        return { summaryID };
      } else {
        Message("success", result.message);
        return { summaryID };
      }
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const fetchInvoiceSummaryDetail = createAsyncThunk(
  "fetchInvoiceSummaryDetail",
  async (
    { page, limit, username, summaryID, search, min, max }: any,
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setDetailLoader(true));
      dispatch(updateSummaryId(summaryID));
      let queryParams = ``;
      if (search) {
        queryParams += `&search=${search}`;
      }
      if (min && max) {
        queryParams += `&min=${min}&manx=${max}`;
      }
      if (limit) {
        queryParams += `&limit=${limit}`;
      }
      const result = (await API_REQUEST_HANDLER(
        `/invoice/details?page=${page}&username=${username}&summaryID=${summaryID}${queryParams}`,
        "get"
      )) as any;
      return result;
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const fetchInvoiceSummaryDetailExport = createAsyncThunk(
  "fetchInvoiceSummaryDetailExport",
  async ({ username, summaryID, page, limit }: any, { rejectWithValue }) => {
    try {
      return (await API_REQUEST_HANDLER(
        `/invoice/details?page=${page}&limit=${limit}&username=${username}&summaryID=${summaryID}`,
        "get"
      )) as any;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteInvoiceSummaryDetail = createAsyncThunk(
  "deleteInvoiceSummaryDetail",
  async ({ detailID, username }: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice/details?id=${detailID}&username=${username}`,
        "delete"
      )) as any;
      return { detailID };
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const acceptRejectInvoiceDetail = createAsyncThunk(
  "acceptRejectInvoiceDetail",
  async (
    { value, detailIDs, summaryID, reason, username }: any,
    { rejectWithValue }
  ) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice/details/${value}?details=${JSON.stringify(
          detailIDs
        )}&reason=${reason}&username=${username}&summaryID=${summaryID}`,
        "put"
      )) as any;
      console.log({ result: result.code, true: result.code !== 200 });
      if (!result || (result?.code && result.code != 200)) {
        Message(
          "danger",
          result?.message ? result?.message : "Something went wrong"
        );
        return true;
      } else {
        Message("success", result.message);
        return result;
      }
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const undoInvoiceDetail = createAsyncThunk(
  "undoInvoiceDetail",
  async ({ detailIDs, username }: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice//details/undo/?ids=${JSON.stringify(
          detailIDs
        )}&username=${username}`,
        "put"
      )) as any;
      console.log({ result: result.code, true: result.code !== 200 });
      if (!result || (result?.code && result.code != 200)) {
        Message(
          "danger",
          result?.message ? result?.message : "Something went wrong"
        );
        return true;
      } else {
        Message("success", result.message);
        return result;
      }
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
);

export const checkInvoiceCarrier = createAsyncThunk(
  "checkInvoiceCarrier",
  async ({ carriercode, username }: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/invoice/summary/required?username=${username}&carriercode=${carriercode}`,
        "get"
      )) as any;
      console.log({ API_REQUEST_HANDLER: result });
      return result;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const importInvoices = createAsyncThunk(
  "importInvoices",
  async ({ creator, username, data, source }: any, { rejectWithValue }) => {
    try {
      const header = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      };
      const result = (await API_REQUEST_HANDLER(
        `/invoice/import/?creator=${creator}&username=${username}`,
        "post",
        data,
        header,
        {
          cancelToken: source.token,
        }
      )) as any;
      console.log({ API_REQUEST_HANDLER: result });
      if (!result || (result?.code && result.code != 200)) {
        Message(
          "danger",
          result?.message ? result?.message : "Something went wrong"
        );
        return true;
      } else {
        // Message("success", result.message);
        return result;
      }
    } catch (err: any) {
      if (err?.message) {
        Message("danger", err?.message ? err?.message : "Something went wrong");
      }
      return rejectWithValue(err);
    }
  }
  // async ({ creator, username, data }: any) => {
  //     console.log({creator, username, data })
  //     const header = {
  //         Accept: 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //     }
  //     const result = await API_REQUEST_HANDLER(`/invoice/import/?creator=${creator}&username=${username}`, 'post', data, header) as any;
  //     console.log({result});
  //     return result
  // }
);

export const updateInvoicesPaginationEntityCount = createAsyncThunk(
  "invoicesPaginationEntityCount",
  async ({ limit }: any) => {
    return limit;
  }
);

export const updateInvoiceDetailPaginationEntityCount = createAsyncThunk(
  "invoiceDetailPaginationEntityCount",
  async ({ limit }: any) => {
    return limit;
  }
);

export const summarySlice = createSlice({
  name: "invoiceSummary",
  initialState,
  reducers: {
    updateSummaryId: (state: typeof initialState, { payload }) => {
      state.summaryID = payload;
    },
    putSummaryID: (
      state: typeof initialState,
      {
        payload,
      }: PayloadAction<{
        summaryID: number;
        status: string;
        filename: string;
        invoiceNumber: string;
        carrierName: string;
        totalCarrier: number;
      }>
    ) => {
      state.summaryID = payload.summaryID;
      state.summaryStatus = payload.status;
      state.filename = payload.filename;
      state.invoiceNumber = payload.invoiceNumber;
      state.carrierName = payload.carrierName;
      state.totalCarrier = payload.totalCarrier;
    },
    clearInvoiceSummaryDetail: (state: typeof initialState) => {
      state.summaryInvoiceDetail = [];
      state.totalSummaryDetail = 0;
      state.detailLoader = true;
    },
    setLoader: (state: typeof initialState, { payload }) => {
      state.loader = payload;
    },
    setDetailLoader: (state: typeof initialState, { payload }) => {
      state.detailLoader = payload;
    },

    resetSummaryState: (state: typeof initialState) => {
      state.loader = true;
      state.detailLoader = true;
      state.summaryInvoice = [];
      state.summaryInvoiceDetail = [];
      state.summaryInvoiceDetailExport = [];
      state.totalSummary = 0;
      state.totalSummaryDetail = 0;
      state.summaryID = null;
      state.summaryStatus = null;
      state.filename = null;
      state.invoiceNumber = null;
      state.carrierName = null;
      state.carrierList = [];
      state.paginationEntityCount = 10;
      state.detailPaginationEntityCount = 10;
      state.totalCarrier = null;
    },

    setSourceData: (state: typeof initialState, { payload }) => {
      state.sourceData = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvoiceSummary.fulfilled, (state, action) => {
      // To Do - after edit user api will be ready
      state.summaryInvoice = [...action.payload.summary];
      state.totalSummary = action.payload.pageInfo?.total;
      state.loader = false;
    }),
      builder.addCase(fetchCarrierList.fulfilled, (state, action) => {
        // To Do - after edit user api will be ready
        state.carrierList = [...action.payload.data];
      }),
      builder.addCase(filterInvoiceSummary.fulfilled, (state, action) => {
        // To Do - after edit user api will be ready
        state.summaryInvoice = action.payload.summary
          ? [...action.payload.summary]
          : [];
        state.totalSummary = action.payload.pageInfo?.total;
        state.loader = false;
      }),
      builder.addCase(acceptRejectInvoiceSummary.fulfilled, (state, action) => {
        // const updateInd = state.summaryInvoice.findIndex(
        //     (item) => action.payload.data.summaryID === item.summaryID
        // );
        // state.summaryInvoice.splice(updateInd, 1, action.payload.data);
      }),
      builder.addCase(deleteInvoiceSummary.fulfilled, (state, action: any) => {
        const updateInd = state.summaryInvoice.findIndex(
          (item) => action.payload.summaryID === item.summaryID
        );
        state.summaryInvoice.splice(updateInd, 1);
      }),
      builder.addCase(fetchInvoiceSummaryDetail.fulfilled, (state, action) => {
        state.summaryInvoiceDetail = [...action.payload.details];
        state.totalSummaryDetail = action.payload.pageInfo?.total;
        state.sourceData = {
          ...state?.sourceData,
          [state?.summaryID || ""]: [...action.payload.details],
        };
        state.detailLoader = false;
      }),
      builder.addCase(fetchInvoiceSummaryDetail.rejected, (state, action) => {
        state.summaryInvoiceDetail = [];
        state.totalSummaryDetail = 0;
        state.detailLoader = false;
      }),
      builder.addCase(
        fetchInvoiceSummaryDetailExport.fulfilled,
        (state, action) => {
          state.summaryInvoiceDetailExport = [...action.payload.details];
          state.detailLoader = false;
        }
      ),
      builder.addCase(
        deleteInvoiceSummaryDetail.fulfilled,
        (state, action: any) => {
          const updateInd = state.summaryInvoiceDetail.findIndex(
            (item) => action.payload.detailID === item.detailsID
          );
          state.summaryInvoiceDetail.splice(updateInd, 1);
        }
      ),
      builder.addCase(acceptRejectInvoiceDetail.fulfilled, (state, action) => {
        // const updateInd = state.summaryInvoice.findIndex(
        //     (item) => action.payload.summaryID === item.summaryID
        // );
        // state.summaryInvoice.splice(updateInd, 1);
      }),
      builder.addCase(importInvoices.fulfilled, (state, action) => {
        state.loadingImport = false;
      }),
      builder.addCase(importInvoices.rejected, (state, action) => {
        state.loadingImport = false;
      }),
      builder.addCase(importInvoices.pending, (state, action) => {
        state.loadingImport = true;
      }),
      builder.addCase(
        updateInvoicesPaginationEntityCount.fulfilled,
        (state, action) => {
          state.paginationEntityCount = action.payload;
        }
      ),
      builder.addCase(
        updateInvoiceDetailPaginationEntityCount.fulfilled,
        (state, action) => {
          state.detailPaginationEntityCount = action.payload;
        }
      );
  },
});

export const {
  putSummaryID,
  clearInvoiceSummaryDetail,
  resetSummaryState,
  setLoader,
  setSourceData,
  updateSummaryId,
  setDetailLoader,
} = summarySlice.actions;

export default summarySlice.reducer;
