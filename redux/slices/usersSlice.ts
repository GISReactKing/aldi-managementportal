import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_REQUEST_HANDLER } from "../../utils/index";
import { message } from "antd";
import { ACCESS_TOKEN } from "../../constants/user";

interface Role {
  _id: string;
  by_default: boolean;
  code: string;
  name: string;
  active: boolean;
  iforce_user: boolean;
  user_admin: boolean;
  user_role: boolean;
  permissions: Permissions;
  created_on: string;
  creator: string;
}

export interface Permissions {
  "Set Up & Control": SetUpControl;
  "Carriage: Claims & Invoicing": CarriageClaimsInvoicing;
  "SKU's & Stock": SKUsStock;
  "Dashboards, Reporting & Enquiries": DashboardsReportingEnquiries;
}

interface DashboardsReportingEnquiries {
  "Order & Returns Enquiry": RolesPermissions;
  "Returns Portal": RolesPermissions;
  "Returns: Dashboard & Reports": ReturnsDashboardReports;
  "Carrier: Dashboard & Reports": CarrierDashboardReports;
}

interface CarrierDashboardReports {
  "Carrier: Dashboard": RolesPermissions;
  "Carrier Routing: Exceptions History": RolesPermissions;
}

interface ReturnsDashboardReports {
  "Returns: Dashboard": RolesPermissions;
  "Returns: Trend Report": RolesPermissions;
}

interface SKUsStock {
  "Item File: Stock Reservation": RolesPermissions;
}

interface CarriageClaimsInvoicing {
  "Claims Preparation": RolesPermissions;
  "Invoice Reconciliation": RolesPermissions;
}

interface SetUpControl {
  "User Administration": UserAdministration;
  "Carrier Routing Control": CarrierRoutingControl;
  "Returns Portal Control": ReturnsPortalControl;
  "Post Purchase Communication": PostPurchaseCommunication;
}

interface PostPurchaseCommunication {
  "Customer Facing: Communication Events": RolesPermissions;
  "Customer email Set Up: Templates & Triggers": RolesPermissions;
}

interface ReturnsPortalControl {
  "Returns Portal Rules": ClientList;
  "Returns Options: Routing Rules": ClientList;
  "Return Reason Codes": RolesPermissions;
}

interface CarrierRoutingControl {
  "Carrier Prices": RolesPermissions;
  "Carrier: Active Dates": RolesPermissions;
  "Carrier: Parcel Limits": RolesPermissions;
  "Carrier Capacity Set Up": RolesPermissions;
  "Product Fixed Routing: Despatch": RolesPermissions;
  "Product Fixed Routing: by Region": RolesPermissions;
  "Multi Box Products: Routing": RolesPermissions;
}

interface UserAdministration {
  "Client List": ClientList;
  "Roles & Permissions": RolesPermissions;
  "Manage Users": RolesPermissions;
  "Activate Users": ClientList;
  "User Activity - Overview": RolesPermissions;
}

interface RolesPermissions {
  "Create / Edit": boolean;
}

interface ClientList {
  "Read Only": boolean;
  "Create / Edit": boolean;
}
export interface IUser {
  _id: string;
  access_token: string;
  first_name: string;
  last_name: string;
  active: boolean;
  phone_number?: string;
  username: string;
  password?: string;
  power_bi_username: string;
  domain_username: string;
  lock: boolean;
  role?: Role;
  client?: string;
  created_on?: string;
  last_login?: string;
  is_login?: boolean;
  isTemporaryPasswordReset?: boolean;
}

export interface Roles {
  _id: string;
  role_type: string;
}

interface IInitialState {
  currentUser: IUser | null;
  usersData: IUser[];
  loader: boolean;
  roles: Roles[];
  rolesAndPermissions: any;
  userActivityLoader: boolean;
  userActivities: any;
  exportUserActivities: any;
  totalUser: number;
  exportLoader: boolean;
  exportUsers: any;
  paginationEntityCount: any;
  defaultPasswordUserId: string | null;
  passwordResetMessage: string[] | null;
}

const initialState: IInitialState = {
  currentUser: null,
  usersData: [],
  roles: [],
  loader: false,
  rolesAndPermissions: [] as any,
  userActivityLoader: true,
  userActivities: [] as any,
  exportUserActivities: [] as any,
  totalUser: 0,
  exportLoader: false,
  exportUsers: [] as any,
  paginationEntityCount: 10,
  defaultPasswordUserId: null,
  passwordResetMessage: null,
};

export const fetchCurrentUsers = createAsyncThunk(
  "fetchCurrentUsers",
  async () => {
    const result = localStorage.getItem("user") as any;
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }
);

export const logoutCurrentUsers = createAsyncThunk(
  "logoutCurrentUsers",
  async () => {
    localStorage.removeItem("user");
    return null;
  }
);

export const fetchUsers = createAsyncThunk(
  "fetchUsers",
  async ({ page, limit, type }: any, { dispatch }) => {
    dispatch(setLoader(true));
    console.log({ page, limit, type });
    const result = (await API_REQUEST_HANDLER(
      `/api/users?page=${page}&limit=${limit}&type=${type}`,
      "get"
    )) as any;
    console.log({ result });
    dispatch(setLoader(false));
    return result;
  }
);

export const fetchUsersExport = createAsyncThunk(
  "fetchUsersExport",
  async ({ type }: any, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setExportLoader(true));
      const result = (await API_REQUEST_HANDLER(
        `/api/users?type=${type}`,
        "get"
      )) as any;
      return result;
    } catch (err) {
      return rejectWithValue(err);
    } finally {
      dispatch(setExportLoader(false));
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "fetchRoles",
  async ({ type }: any) => {
    const result = (await API_REQUEST_HANDLER(
      `/rolesAndPermission/types?type=${type}`,
      "get"
    )) as any;
    return result.data;
  }
);

export const fetchExportUserActivity = createAsyncThunk(
  "fetchExportUserActivity",
  async (type: string) => {
    const result = (await API_REQUEST_HANDLER(
      `/useractivity?type=${type}`,
      "get"
    )) as any;
    return result.data;
  }
);

export const fetchUserActivity = createAsyncThunk(
  "fetchUserActivity",
  async (type: string) => {
    const result = (await API_REQUEST_HANDLER(
      `/useractivity?type=${type}`,
      "get"
    )) as any;
    return result.data;
  }
);

export const signinUsers = createAsyncThunk(
  "signinUsers",
  async (data: any, { rejectWithValue }) => {
    try {
      // if (
      //   data.username.toLowerCase() === "tempadmin@aldi.com" &&
      //   data.password === "Password123!"
      // ) {
      //   return User;
      // }
      let result = (await API_REQUEST_HANDLER(
        "/api/users/login",
        "post",
        data
      )) as any;
      // result.data.role_name = result.data.role_name.map((item: any) => item._id);
      console.log({ result });

      return result.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "changeUserPassword",
  async (data: any, { rejectWithValue }) => {
    const headers = {
      access_token: localStorage.getItem("access_token"),
      "Content-Type": "application/json",
    };
    try {
      let result = (await API_REQUEST_HANDLER(
        "/api/users/resetpassword",
        "put",
        data,
        headers
      )) as any;
      // result.data.role_name = result.data.role_name.map((item: any) => item._id);
      console.log({ result });
      return result.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeResetUserPassword = createAsyncThunk(
  "changeResetPassword",
  async (username: any, { rejectWithValue }) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/api/users/requestpasswordreset?username=${username}`,
        "get"
      )) as any;

      return result;
    } catch (err: any) {
      message.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const createUsers = createAsyncThunk(
  "createUsers",
  async (data: object, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoader(true));
      const result = (await API_REQUEST_HANDLER(
        "/api/users",
        "post",
        data
      )) as any;
      return result.data;
    } catch (err: any) {
      return rejectWithValue(err);
    } finally {
      dispatch(setLoader(false));
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (data: IUser, { dispatch }) => {
    // start loader
    dispatch(setLoader(true));

    let newData = {
      ...data,
      role: data?.role?._id || data?.role,
    };
    const result = (await API_REQUEST_HANDLER(
      "/api/users",
      "put",
      newData
    )) as any;

    // cancel loader
    dispatch(setLoader(false));
    return result.data;
  }
);

export const checkUserName = async (email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = (await API_REQUEST_HANDLER(
        `/api/users/exist?username=${email}`,
        "get"
      )) as any;
      reject();
    } catch (err: any) {
      resolve(err?.message);
    }
  });
};

export const deleteUser = createAsyncThunk(
  "deleteUser",
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
    await API_REQUEST_HANDLER(`/api/users?${path}`, "delete");
    return { idString };
  }
);

export const updateUsersPaginationEntityCount = createAsyncThunk(
  "usersPaginationEntityCount",
  async ({ limit }: any) => {
    return limit;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (
      state: typeof initialState,
      { payload }: PayloadAction<{ user: IUser }>
    ) => {
      state.usersData.push(payload.user);
    },
    getUsers: (state: typeof initialState) => {
      API_REQUEST_HANDLER("/api/users", "get")
        .then((result: any) => {
          console.log({ result });
          state.usersData = [...state.usersData, ...result.data];
          state.loader = false;
        })
        .catch(() => {
          // state.loader = false;
        });
    },
    deleteUser: (
      state: typeof initialState,
      { payload }: PayloadAction<{ user: IUser }>
    ) => {
      state.usersData.push(payload.user);
    },
    resetUserState: (state: typeof initialState) => {
      state.currentUser = null;
      state.usersData = [];
      state.roles = [];
      state.loader = false;
      state.rolesAndPermissions = [];
      state.userActivityLoader = true;
      state.userActivities = [];
      state.exportUserActivities = [];
      state.totalUser = 0;
      state.exportLoader = false;
      state.exportUsers = [];
      state.paginationEntityCount = 10;
      state.defaultPasswordUserId = null;
    },
    clearPasswordResetMessage: (state: typeof initialState) => {
      state.passwordResetMessage = null;
    },
    setLoader: (
      state: typeof initialState,
      { payload = false }: { payload: boolean }
    ) => {
      state.loader = payload;
    },
    setExportLoader: (
      state: typeof initialState,
      { payload = false }: { payload: boolean }
    ) => {
      state.exportLoader = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.usersData = action.payload.data;
      state.totalUser = action.payload.total;
      state.loader = false;
    }),
      builder.addCase(fetchCurrentUsers.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      }),
      builder.addCase(logoutCurrentUsers.fulfilled, (state, action) => {
        // @ts-ignore
        state.currentUser = action.payload;
      }),
      builder.addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      }),
      builder.addCase(fetchExportUserActivity.fulfilled, (state, action) => {
        state.exportUserActivities = action.payload;
      }),
      builder.addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.userActivities = action.payload;
        state.userActivityLoader = false;
      }),
      builder.addCase(createUsers.fulfilled, (state, action) => {
        if (state?.currentUser?.role?.iforce_user) {
          state.usersData.push(action.payload);
        } else if (
          !action?.payload?.role?.iforce_user &&
          !state?.currentUser?.role?.iforce_user
        ) {
          state.usersData.push(action.payload);
        }
        state.loader = false;
      }),
      builder.addCase(signinUsers.fulfilled, (state, action) => {
        // state.defaultPasswordUserId = action.payload._id;
        localStorage.setItem("access_token", action.payload.access_token);

        // if (action.payload.isDefaultPasswordReset) {
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("access_token", action.payload.access_token);
        message.success("Sign-in has been successful");
        state.currentUser = action.payload;
        // }
      }),
      builder.addCase(changeUserPassword.fulfilled, (state, action) => {
        message.success(
          "Password reset successfully! Please login with you new password.!"
        );
      }),
      builder.addCase(changeResetUserPassword.fulfilled, (state, action) => {
        // message.success(action.payload.message);
        state.passwordResetMessage = action.payload.message || [""];
      }),
      builder.addCase(deleteUser.fulfilled, (state, action) => {
        console.log({ action: action.payload });
        const updateData = state.usersData.filter(
          (item) => action.payload.idString.indexOf(item._id) == -1
        );
        state.usersData = updateData;
      }),
      builder.addCase(updateUser.fulfilled, (state: any, action) => {
        console.log({ action: action.payload });
        const updateInd = state.usersData.findIndex(
          (item: any) => action.payload._id === item._id
        );
        if (action.payload._id === state.currentUser._id) {
          state.currentUser = action.payload;
          localStorage.setItem("access_token", action.payload.access_token);

          // if (action.payload.isDefaultPasswordReset) {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("access_token", action.payload.access_token);
        }
        state.usersData.splice(updateInd, 1, action.payload);

        // if (state?.currentUser?.client) {
        //   state.usersData.splice(updateInd, 1, action.payload);
        // } else if (
        //   !action?.payload?.role?.iforce_user &&
        //   !state?.currentUser?.role?.iforce_user
        // ) {
        //   state.usersData.splice(updateInd, 1, action.payload);
        // }
      }),
      builder.addCase(fetchUsersExport.fulfilled, (state, action) => {
        state.exportUsers = [...action.payload.data];
        state.exportLoader = false;
      });
    builder.addCase(
      updateUsersPaginationEntityCount.fulfilled,
      (state, action) => {
        state.paginationEntityCount = action.payload;
      }
    );
  },
});

// Selectors
// export const getUser = (state: any) => state.users;

// Reducers and actions
export const {
  addUser,
  getUsers,
  resetUserState,
  clearPasswordResetMessage,
  setLoader,
  setExportLoader,
} = usersSlice.actions;

export default usersSlice.reducer;

// Message("success", results?.payload.);
