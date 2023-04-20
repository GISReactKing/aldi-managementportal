import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils";
import store from "../store";
export interface IRolesAndPermission {
  _id: string;
  by_default: boolean;
  role_name: string;
  role_type: string;
  permissions: any;
  created_on: string;
  creator: string;
}

export interface Roles {
  _id: string;
  role_type: string;
}

interface IInitialState {
  loader: boolean;
  exportLoader: boolean;
  rolesAndPermissions: IRolesAndPermission[];
  exportRolesAndPermissions: any;
  editedUserId: null | string;
  roles: any;
  allRoles: any;
  totalRole: number;
  paginationEntityCount: number;
}

const initialState: IInitialState = {
  loader: true,
  exportLoader: true,
  rolesAndPermissions: [] as IRolesAndPermission[],
  exportRolesAndPermissions: [] as any,
  editedUserId: null,
  roles: [] as any,
  allRoles: [] as any,
  totalRole: 0,
  paginationEntityCount: 10,
};

export const checkRoleNameCode = async ({ code, name }: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = `code=${code}&name=${name}`;
      // if (code) {
      //   params += `code=${code}`;
      // }
      // if (name) {
      //   params += `name=${name}`;
      // }

      const result = (await API_REQUEST_HANDLER(
        `/rolesAndPermission/exist?${params}`,
        "get"
      )) as any;
      resolve("");
    } catch (err: any) {
      resolve(err?.message);
    }
  });
};

export const fetchAllRoles = createAsyncThunk("fetchAllRoles", async () => {
  const result = (await API_REQUEST_HANDLER(
    "/rolesAndPermission/types",
    "get"
  )) as any;
  return result.data;
});

export const fetchRolesAndPermission = createAsyncThunk(
  "fetchRolesAndPermission",
  async ({ page, limit, type }: any) => {
    console.log(
      page,
      limit,
      type,
      "page, limit, typepage, limit, typepage, limit, typepage, limit, type"
    );
    const result = (await API_REQUEST_HANDLER(
      `/rolesAndPermission?page=${page}&limit=${limit}&type=${type}`,
      "get"
    )) as any;
    console.log({ fetchRolesAndPermissionAPI_REQUEST_HANDLER: result });
    return result;
  }
);

export const createRolesAndPermission = createAsyncThunk(
  "createRolesAndPermission",
  async (data: any) => {
    const result = (await API_REQUEST_HANDLER(
      "/rolesAndPermission",
      "post",
      data
    )) as any;
    console.log({ fetchRolesAndPermissionAPI_REQUEST_HANDLER: result });
    return result;
  }
);

export const updateRolesAndPermission = createAsyncThunk(
  "updateRolesAndPermission",
  async (data: any) => {
    const result = (await API_REQUEST_HANDLER(
      "/rolesAndPermission",
      "put",
      data
    )) as any;

    return result.data;
  }
);

export const deleteRolesAndPermission = createAsyncThunk(
  "deleteRolesAndPermission",
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
    await API_REQUEST_HANDLER(`/rolesAndPermission?${path}`, "delete");
    return { idString };
  }
);

export const fetchUserRoles = createAsyncThunk(
  "fetchUserRoles",
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
    console.log({ id, ids, idString, path });
    const result = (await API_REQUEST_HANDLER(
      `/rolesAndPermission?${path}`,
      "get"
    )) as any;
    console.log({ update: result.data });
    return result.data;
  }
);

export const fetchRolesAndPermissionExport = createAsyncThunk(
  "fetchRolesAndPermissionExport",
  async ({ type }: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/rolesAndPermission?type=${type}`,
        "get"
      )) as any;
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateRolesPaginationEntityCount = createAsyncThunk(
  "rolesPaginationEntityCount",
  async ({ limit }: any) => {
    return limit;
  }
);

export const rolesAndPermissionSlice = createSlice({
  name: "newRolesAndPermissions",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loader = true;
      state.exportLoader = true;
      state.rolesAndPermissions = [];
      state.exportRolesAndPermissions = [];
      state.editedUserId = null;
      state.roles = [];
      state.allRoles = [];
      state.totalRole = 0;
      state.paginationEntityCount = 10;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRolesAndPermission.fulfilled, (state, action) => {
      let tmpData = action.payload.data.map((item: any) => ({
        ...item,
        title: `${item.code}: ${item.name}`,
      }));
      state.rolesAndPermissions = [...tmpData];
      state.totalRole = action.payload.total;
      state.loader = false;
    }),
      builder.addCase(createRolesAndPermission.fulfilled, (state, action) => {
        // const currentUser = store.getState().users.currentUser;
        // if (!currentUser?.role?.iforce_user) {
        //   state.rolesAndPermissions = [...state.rolesAndPermissions, action.payload];
        // }
        // else if (!currentUser?.role?.iforce_user && !action.payload.iforce_user) {
        //   state.rolesAndPermissions = [...state.rolesAndPermissions, action.payload];
        // }
        state.rolesAndPermissions = [
          ...state.rolesAndPermissions,
          {
            ...action.payload,
            title: `${action.payload.code}: ${action.payload.name}`,
          },
        ];
        state.loader = false;
      }),
      builder.addCase(updateRolesAndPermission.fulfilled, (state, action) => {
        const updateInd = state.rolesAndPermissions.findIndex(
          (item) => action.payload._id === item._id
        );
        // const currentUser = store.getState().users.currentUser;
        // if (!currentUser?.role?.iforce_user) {
        //   state.rolesAndPermissions.splice(updateInd, 1, action.payload)
        // }
        // else if (!currentUser?.role?.iforce_user && !action.payload.iforce_user) {
        //   state.rolesAndPermissions.splice(updateInd, 1, action.payload)
        // }
        state.rolesAndPermissions.splice(updateInd, 1, {
          ...action.payload,
          title: `${action.payload.code}: ${action.payload.name}`,
        });
      }),
      builder.addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      }),
      builder.addCase(deleteRolesAndPermission.fulfilled, (state, action) => {
        console.log({
          action: action.payload,
          rolesAndPermissionsstate: state.rolesAndPermissions,
        });
        const updateData = state.rolesAndPermissions.filter(
          (item) => action.payload.idString.indexOf(item._id) == -1
        );
        state.rolesAndPermissions = updateData;
      }),
      builder.addCase(
        fetchRolesAndPermissionExport.fulfilled,
        (state, action) => {
          state.exportRolesAndPermissions = [...action.payload.data];
          state.exportLoader = false;
        }
      ),
      builder.addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.allRoles = [...action.payload];
      });
    builder.addCase(
      updateRolesPaginationEntityCount.fulfilled,
      (state, action) => {
        state.paginationEntityCount = action.payload;
      }
    );
  },
});

export const { resetState } = rolesAndPermissionSlice.actions;

export default rolesAndPermissionSlice.reducer;
