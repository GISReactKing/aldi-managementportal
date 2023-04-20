import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants/user";
export interface ISummaryOrderHistory {
  _id: string;
  orderDate: string;
  orderNo: string;
  deliveryPostCode: string;
  parcels: number;
  orderLines: number;
  deliveryItems: number;
  deliveryValue: number;
  deliveryStatus: string;
  returnedItems: number;
  RefundValue: number;
  RefundStatus: string;
}

const MockSummaryOrderHistory = [
  {
    _id: "1",
    orderDate: "12/22/21",
    orderNo: "5123455",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "2",
    orderDate: "12/22/21",
    orderNo: "5123457",
    customerEmail: "test1@gmailsdsd.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "3",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmailaa.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "4",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "5",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "6",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 1,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "7",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "8",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "9",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "10",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "11",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "12",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "13",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "14",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "15",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "16",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "17",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
  {
    _id: "18",
    orderDate: "12/22/21",
    orderNo: "5123456",
    customerEmail: "test1@gmail.com",
    deliveryPostCode: "B109YZ",
    parcels: 4,
    orderLines: 1,
    deliveryItems: 6,
    deliveryValue: 13.0,
    deliveryStatus: "Part Delivered",
    returnedItems: 0,
    RefundValue: 20.0,
    RefundStatus: "Parcel at Carrier Depot",
  },
];

interface IInitialState {
  summaryOrderHistory: any | [];
}

const initialState: IInitialState = {
  summaryOrderHistory: MockSummaryOrderHistory,
};

export const claimsPreparationSlice = createSlice({
  name: "productFixedRouting",
  initialState,
  reducers: {
    fetchSummaryOrderHistory: (state: typeof initialState) => {
      state.summaryOrderHistory = MockSummaryOrderHistory;
    },
    resetProductFixedRoutingState: (state: typeof initialState) => {
      state.summaryOrderHistory = MockSummaryOrderHistory;
    },
  },
});

// Selectors
// export const getUser = (state: any) => state.users;

// Reducers and actions
export const { fetchSummaryOrderHistory, resetProductFixedRoutingState } =
  claimsPreparationSlice.actions;

export default claimsPreparationSlice.reducer;
