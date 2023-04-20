import { configureStore } from "@reduxjs/toolkit";

import claimsSlice from "./slices/claimsPrepSlice";
import usersSlice from "./slices/usersSlice";
import exceptionHistorySlice from "./slices/exceptionHistorySlice";
import newRolesAndPermissionSlice from "./slices/newRolesAndPermissionSlice";
import navTabsSlice from "./slices/navTabs";
import returnItemsSlice from "./slices/returnItemsSlice";
import clientSlice from "./slices/clientSlice";
import invoiceSummary from "./slices/SummarySlice";
import productFixingRoutingByRegionSlice from "./slices/productFixingRoutingByRegionSlice";
import productFixedRoutingDespatch from "./slices/productFixedRoutingDespatch";
import claimsPreparationSlice from "./slices/claimsPreparationSlice";
import multiBoxProductsRoutingSlice from "./slices/multiBoxProductsRoutingSlice";
import carrierPriceSlice from "./slices/CarrierPriceSlice";
import carrierCapacitySetupSlice from "./slices/carrierCapacitySetupSlice";
import ItemFileStockReservationSlice from "./slices/ItemFileStockReservationSlice";
import carrierServicesActiveDatesSlice from "./slices/carrierServicesActiveDatesSlice";
import userActivationSlice from "./slices/userActivation";
import carrierParcelLimitsSlice from "./slices/CarrierParcelLimitsSlice";
import themeSlice from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    users: usersSlice,
    claims: claimsSlice,
    newRolesAndPermissions: newRolesAndPermissionSlice,
    navTabs: navTabsSlice,
    returnItems: returnItemsSlice,
    client: clientSlice,
    invoiceSummary: invoiceSummary,
    productFixingRoutingByRegion: productFixingRoutingByRegionSlice,
    productFixedRoutingDespatch: productFixedRoutingDespatch,
    claimsPreparation: claimsPreparationSlice,
    multiBoxProductsRouting: multiBoxProductsRoutingSlice,
    carrierPrice: carrierPriceSlice,
    carrierCapacitySetup: carrierCapacitySetupSlice,
    itemFileStockReservation: ItemFileStockReservationSlice,
    carrierServicesActive: carrierServicesActiveDatesSlice,
    exceptionHistory: exceptionHistorySlice,
    userActivation: userActivationSlice,
    carrierParcelLimits: carrierParcelLimitsSlice,
    theme: themeSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
