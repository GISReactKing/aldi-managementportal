import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";

import { ACCESS_TOKEN } from "../../constants/user";
import { Message } from "../../utils/message";

export interface Order {
  orderLine: number;
  product: string;
  qty: number;
  retailValue: number;
}

export interface Parcel {
  parcelNo: string;
  parcelKg: number;
  dateDispatched: string;
  dateReturned: string;
  firstCarrierScan: string;
  dateDelivery: string;
  latestStatus: string;
  ageDays: number;
  order: Order[];
}

export interface Claim {
  consignmentNo: string;
  carrier: string;
  deliveryService: string;
  parcel: Parcel[];
}

export interface Claims {
  type: string;
  claim: Claim[];
}

export interface Data {
  totalRows: number;
  claims: Claims;
}

interface CustomerInfo {
  fullName: string;
  deliveryAddress: string;
  email: string;
  phoneNumber: string;
  orderNo: string;
  orderDate: string;
  postCode?: string;
}

export interface IInvoicingClaim {
  status: number;
  data: Data;
  customerInfo: CustomerInfo;
}

export interface claim {
  Customer_Name: string;
  Order_Date: number;
  Customer_Reference_No: string;
  PostCode_Part1: string;
  PostCode_Part2: string;
  Number_Of_Parcels: number;
  Number_Of_Order_Lines: number;
  Delivered_Quantity: number;
  Delivered_Value: number;
  Delivered_Status: string;
  Returned_Quantity: number;
  Returned_Status: string;
}

export interface Data {
  totalRows: number;
  rows: claim[];
}

export interface IClaim {
  status: number;
  data: Data;
}

export interface IApiError {
  code: string;
  message: string;
}

interface IInitialState {
  claim: IClaim | null;
  invoicingClaimPrep: IInvoicingClaim | null;
  loading: boolean;
  apiError?: IApiError;
}

// {
//   status: 200,
//   data: {
//     totalRows: 2,
//     claims: [
//       {
//         type: "Returns",
//         claim: []
//       },
//       {
//         type: "Delivery",
//         claim: [
//           {
//             consignmentNo: "ZDBXXX169245001",
//             carrier: "XDP",
//             deliveryService: "Standard Delivery",
//             parcel: [
//               {
//                 parcelNo: "ZDBXXX169245001",
//                 parcelKg: "5.00",
//                 dateDispatched: "03/05/2022",
//                 dateReturned: "",
//                 firstCarrierScan: "06/05/2022",
//                 dateDelivery: "07/05/2022",
//                 latestStatus: "DELIVERY",
//                 ageDays: 23,
//                 order: [
//                   {
//                     orderLine: 1,
//                     product: "714917516739400: Ambiano Black Digital Microwave!",
//                     qty: 1,
//                     retailValue: "599.90"
//                   }
//                 ]
//               }
//             ]
//           },
//           {
//             consignmentNo: "ZDBXXX169246001",
//             carrier: "XDP",
//             deliveryService: "Standard Delivery",
//             parcel: [
//               {
//                 parcelNo: "ZDBXXX169246001",
//                 parcelKg: "0.84",
//                 dateDispatched: "03/05/2022",
//                 dateReturned: "",
//                 firstCarrierScan: "06/05/2022",
//                 dateDelivery: "07/05/2022",
//                 latestStatus: "DELIVERY",
//                 ageDays: 23,
//                 order: [
//                   {
//                     orderLine: 2,
//                     product: "019409530651105: Nuby Frog Waterfall Bath Toy.",
//                     qty: 2,
//                     retailValue: "199.90"
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     customerInfo: {
//       fullName: "Peter Peterson",
//       deliveryAddress: "33 St. Mary's Street, Edinburgh, Scotland, EH1 1TA",
//       email: "ketttest1@gmail.com",
//       phoneNumber: "",
//       orderNo: "ORDERS29042022_502",
//       orderDate: "29/04/2022",
//       postCode: "EH1 1TA"
//     }
//   }
// }

const initialState: IInitialState = {
  claim: null,
  invoicingClaimPrep: null,
  loading: false,
};

export const fetchClaims = createAsyncThunk(
  "fetchClaims",
  async (data: object, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const headers = {
        access_token: localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      };

      const result = (await API_REQUEST_HANDLER(
        "/claims/search",
        "post",
        data,
        headers
      )) as any;

      return result.data;
    } catch (error: any) {
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoading(false));
    }
  }
);

export const fetchInvoicingClaimPrep = createAsyncThunk(
  "fetchInvoicingClaimPrep",
  async (data: object, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const headers = {
        access_token: localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      };

      const result = (await API_REQUEST_HANDLER(
        "/claims/search",
        "post",
        data,
        headers
      )) as any;

      dispatch(setLoading(false));

      return result.data;
    } catch (error: any) {
      // rejectWithValue(error);
      Message(
        "danger",
        error?.message ? error?.message : "Something went wrong"
      );

      dispatch(setLoading(false));
      return error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetClaimsPrepState: (state) => {
      state.claim = null;
      state.invoicingClaimPrep = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClaims.fulfilled, (state, action) => {
      state.claim = action.payload;
    });
    builder.addCase(fetchInvoicingClaimPrep.fulfilled, (state, action) => {
      state.invoicingClaimPrep = action.payload;
    });
  },
});

// Reducers and actions
export const { setLoading, resetClaimsPrepState } = claimsSlice.actions;

export default claimsSlice.reducer;
