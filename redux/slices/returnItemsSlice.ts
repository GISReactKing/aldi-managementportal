import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";

export interface IReturnItem {
  _id: string;
  product_description: string;
  available_return: string;
  value: string;
  quantity: string;
  reason: string;
  photo?: string;
  information: string;
  return_quantity: string;
  date: string;
  creator: string;
  created_on: string;
  __v: string;
}

interface IInitialState {
  returnItemsData: IReturnItem[];
  loader: boolean;
}

const mockData = [] as any;

const initialState: IInitialState = {
  returnItemsData: mockData as any,
  loader: true,
};

export const fetchReturnItems = createAsyncThunk(
  "fetchReturnItems",
  async () => {
    const result = (await API_REQUEST_HANDLER("/returnItems", "get")) as any;
    return result.data;
  }
);

export const createReturnItems = createAsyncThunk(
  "createReturnItems",
  async (data: object) => {
    const result = (await API_REQUEST_HANDLER(
      "/returnItems",
      "post",
      data
    )) as any;
    console.log({ create: result });
    return result;
  }
);

export const updateReturnItems = createAsyncThunk(
  "updateReturnItems",
  async (data: object) => {
    const result = (await API_REQUEST_HANDLER(
      "/returnItems",
      "put",
      data
    )) as any;
    console.log({ update: result });
    return result.data;
  }
);

export const deleteReturnItem = createAsyncThunk(
  "deleteReturnItem",
  async ({ id, ids }: { id?: string; ids?: string }) => {
    let idString = [] as string[];
    let path = "";
    if (id) {
      path += `id=${id}`;
      idString.push(id);
    } else if (ids) {
      path += `ids=${ids}`;
      idString = ids.split(",");
    }
    console.log({ id, ids, idString });
    await API_REQUEST_HANDLER(`/returnItems?${path}`, "delete");
    return { idString };
  }
);

export const returnItemsSlice = createSlice({
  name: "returnItems",
  initialState,
  reducers: {
    resetReturnItemState: (state) => {
      state.returnItemsData = mockData;
      state.loader = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReturnItems.fulfilled, (state, action) => {
      state.returnItemsData = action.payload;
      state.loader = false;
    });
    builder.addCase(createReturnItems.fulfilled, (state, action) => {
      state.returnItemsData.push(action.payload);
      state.loader = false;
    });
    builder.addCase(deleteReturnItem.fulfilled, (state, action) => {
      state.returnItemsData = state.returnItemsData.filter(
        (item) => action.payload.idString.indexOf(item._id) == -1
      );
    });
    builder.addCase(updateReturnItems.fulfilled, (state, action) => {
      state.returnItemsData.splice(
        state.returnItemsData.findIndex(
          (item) => action.payload._id === item._id
        ),
        1,
        action.payload
      );
    });
  },
});

export const { resetReturnItemState } = returnItemsSlice.actions;

export default returnItemsSlice.reducer;
