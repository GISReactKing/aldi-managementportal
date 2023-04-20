import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import {
  MultiBoxProductsRoutingPath,
  ProductFixedRoutingByRegionPath,
  ProductFixedRoutingDespatchPath,
  RolesAndPermissionsPath,
  CarrierCapacitySetUpPath,
  CarrierParcelLimitsPath,
  CarrierServicesActiveDatesPath,
  ClaimsPreparationPath,
  CarrierRoutingExceptionsHistoryPath,
  ItemFileStockReservationPath,
  ReturnsPortalPath,
  InvoiceReconciliationPath,
  ManageUsersPath,
} from "../../constants/path-name";
import { resetMultiBoxState } from "./multiBoxProductsRoutingSlice";
import { resetProductFixedRoutingDespatchState } from "./productFixedRoutingDespatch";
import { resetState as resetProductFixedRoutingByRegionState } from "./productFixingRoutingByRegionSlice";
import { resetState as resetRolesAndPermissionsState } from "./newRolesAndPermissionSlice";
import { resetCarrierCapacitySetupState } from "./carrierCapacitySetupSlice";
// import { resetCarrierPriceLimitsState } from "./CarrierParcelLimitsSlice";
import { resetCarrierServicesActiveState } from "./carrierServicesActiveDatesSlice";
import { resetProductFixedRoutingState } from "./claimsPreparationSlice";
import { resetClaimsPrepState } from "./claimsPrepSlice";
import { resetExceptionHistoryState } from "./exceptionHistorySlice";
import { resetItemFileStockReservationState } from "./ItemFileStockReservationSlice";
import { resetReturnItemState } from "./returnItemsSlice";
import { resetSummaryState } from "./SummarySlice";
import { resetUserState } from "./usersSlice";

const stateSliceReset: { [key: string]: ActionCreatorWithoutPayload<string> } =
  {
    [MultiBoxProductsRoutingPath]: resetMultiBoxState,
    [ProductFixedRoutingDespatchPath]: resetProductFixedRoutingDespatchState,
    [ProductFixedRoutingByRegionPath]: resetProductFixedRoutingByRegionState,
    [RolesAndPermissionsPath]: resetRolesAndPermissionsState,

    [CarrierCapacitySetUpPath]: resetCarrierCapacitySetupState,
    // [CarrierParcelLimitsPath]: resetCarrierPriceLimitsState,
    [CarrierServicesActiveDatesPath]: resetCarrierServicesActiveState,
    // [ProductFixedRoutingDespatchPath]: resetProductFixedRoutingState,
    [ClaimsPreparationPath]: resetClaimsPrepState,
    [CarrierRoutingExceptionsHistoryPath]: resetExceptionHistoryState,
    [ItemFileStockReservationPath]: resetItemFileStockReservationState,
    [ReturnsPortalPath]: resetReturnItemState,
    [InvoiceReconciliationPath]: resetSummaryState,
    [ManageUsersPath]: resetUserState,
  };

export const getStateSliceResetter = (path: string) => {
  return stateSliceReset[path];
};
