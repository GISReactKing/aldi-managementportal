import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";

export interface IClient {
  _id?: string;
  code: string;
  name: string;
  created_on?: string;
}

interface IInitialState {
  loader: boolean;
  clientList: IClient[];
  editClientId: null | string;
  totalClient: number;
}

const initialState: IInitialState = {
  loader: true,
  clientList: [] as IClient[],
  editClientId: null,
  totalClient: 0,
};

export const fetchClientList = createAsyncThunk(
  "fetchClientList",
  async ({ page, limit }: any) => {
    const result = (await API_REQUEST_HANDLER(
      `/clients?page=${page}&limit=${limit}`,
      "get"
    )) as any;
    console.log({ fetchClientListAPI_REQUEST_HANDLER: result });
    return result;
  }
);

export const createClient = createAsyncThunk(
  "createClient",
  async (data: any) => {
    const result = (await API_REQUEST_HANDLER("/clients", "post", data)) as any;
    console.log({ fetchClientListAPI_REQUEST_HANDLER: result });
    return result;
  }
);

export const updateClient = createAsyncThunk(
  "updateClient",
  async (data: any) => {
    const result = (await API_REQUEST_HANDLER("/clients", "put", data)) as any;
    console.log({ fetchClientListAPI_REQUEST_HANDLER: result });
    return result.data;
  }
);

export const deleteClient = createAsyncThunk(
  "deleteClient",
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
    await API_REQUEST_HANDLER(`/clients?${path}`, "delete");
    return { idString };
  }
);

export const clientListSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    resetClientState: (state) => {
      state.loader = true;
      state.clientList = [];
      state.editClientId = null;
      state.totalClient = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClientList.fulfilled, (state, action) => {
      // To Do - after edit user api will be ready
      state.clientList = action.payload.data;
      state.totalClient = action.payload.total;
      state.loader = false;
    }),
      builder.addCase(createClient.fulfilled, (state, action) => {
        state.clientList.push(action.payload);
        state.loader = false;
      }),
      builder.addCase(updateClient.fulfilled, (state, action) => {
        console.log({ action: action.payload });
        const updateInd = state.clientList.findIndex(
          (item) => action.payload._id === item._id
        );
        state.clientList.splice(updateInd, 1, action.payload);
      }),
      builder.addCase(deleteClient.fulfilled, (state, action) => {
        console.log({ action: action.payload });
        const updateData = state.clientList.filter(
          (item: any) => action.payload.idString.indexOf(item._id) == -1
        );
        state.clientList = updateData;
      });
  },
});

export const { resetClientState } = clientListSlice.actions;

export default clientListSlice.reducer;
