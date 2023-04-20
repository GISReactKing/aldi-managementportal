import { Router, NextRouter } from "next/router";
import _ from "lodash";
import { AppDispatch } from "../redux/store";
import {
  addUniqueNavTab,
  INavTabs,
  removeTabByIds,
} from "../redux/slices/navTabs";
import {
  DeliveryEventsOrderPath,
  OrderAndReturnsEnquiryPath,
  ReturnEventOrderPath,
  ReturnPortalsOrderPath,
  SummaryForOrderPath,
  SummaryOrderHistoryPath,
} from "../constants/path-name";

const sortAlphabetical = (arr: any[], key: string) =>
  arr.sort((a: any, b: any) =>
    a?.[key] < b?.[key] ? -1 : a?.[key] > b?.[key] ? 1 : 0
  );

const carrierPricesCSVHeaders = (
  label: string = "label",
  key: string = "value"
) => {
  const headers: any = [
    { [label]: "Type", [key]: "pricing_method" },
    { [label]: "Carriers", [key]: "name" },
    { [label]: "Active", [key]: "status" },
    {
      [label]: "Contract",
      [key]: "contracts",
    },
    { [label]: "Service", [key]: "serviceDescription" },
    {
      [label]: "Despatch Method Description",
      [key]: "dispatch_method_description",
    },

    { [label]: "Unit", [key]: "unit" },
    { [label]: "Matrix Row", [key]: "matrixRow" },

    { [label]: "Base Price", [key]: "primaryBaseCost", format: "£#,##0.00" },
    { [label]: "From Unit", [key]: "primaryFromUnit", format: "#,##0.00" },
    {
      [label]: "Incremental Price",
      [key]: "primaryIncrementalPrice",
      format: "£#,##0.00",
    },
    {
      [label]: "Increment Start",
      [key]: "primaryIncrementStart",
      format: "#,##0.00",
    },
    {
      [label]: "Unit Increment",
      [key]: "primaryUnitIncrement",
      format: "#,##0.00",
    },

    {
      [label]: "Permanent Date From",
      [key]: "secondaryPermanentDateFrom",
    },
    { [label]: "Temp Date From", [key]: "secondaryTempDateFrom" },
    { [label]: "Temp Date To", [key]: "secondaryTempDateTo" },
    { [label]: "Sec_Matrix Row", [key]: "secMatrixRow" },

    {
      [label]: "Sec_Base Price",
      [key]: "secondaryBaseCost",
      format: "£#,##0.00",
    },
    {
      [label]: "Sec_From Unit",
      [key]: "secondaryFromUnit",
      format: "#,##0.00",
    },
    {
      [label]: "Sec_Incremental Price",
      [key]: "secondaryIncrementalPrice",
      format: "£#,##0.00",
    },
    {
      [label]: "Sec_Increment Start",
      [key]: "secondaryIncrementStart",
      format: "#,##0.00",
    },
    {
      [label]: "Sec_Unit Increment",
      [key]: "secondaryUnitIncrement",
      format: "#,##0.00",
    },
  ];
  return headers;
};

const carrierPricesCSVDataConverter = (carrierPriceList: any) => {
  if (carrierPriceList?.costings) {
    let data: any = [];
    carrierPriceList?.costings?.forEach((carrierPrice: any) => {
      const matrixSecondaryDate = carrierPrice?.secondaryCosting;

      const matrixSecondary =
        carrierPrice?.secondaryCosting?.costingMatrix?.rows?.[0];

      const matrixPrimary =
        carrierPrice?.primaryCosting?.costingMatrix?.rows?.[0];

      data.push({
        pricing_method: carrierPrice?.pricingMethod,
        name: carrierPrice?.carrierName || carrierPrice.carrier,
        status: carrierPrice.active ? "Y" : "N",
        serviceDescription: carrierPrice?.serviceDescription,
        dispatch_method_description: carrierPrice?.methodDescription,
        contracts: carrierPrice.contracts,
        unit:
          carrierPrice?.pricingMethod === "By Weight Matrix"
            ? "KG"
            : carrierPrice?.pricingMethod === "None"
            ? ""
            : "Parcel",

        matrixRow: matrixPrimary?.chargeID,
        primaryBaseCost: matrixPrimary?.baseCost
          ? Number(matrixPrimary?.baseCost)
          : carrierPrice?.primaryCosting?.baseCost
          ? Number(carrierPrice?.primaryCosting?.baseCost)
          : null,

        primaryFromUnit: Number(matrixPrimary?.fromParcel)
          ? Number(matrixPrimary?.fromParcel)
          : Number(carrierPrice?.primaryCosting?.fromParcel)
          ? Number(carrierPrice?.primaryCosting?.fromParcel)
          : null,
        primaryIncrementalPrice: Number(matrixPrimary?.incrementalCost)
          ? Number(matrixPrimary?.incrementalCost)
          : Number(carrierPrice?.primaryCosting?.incrementalCost)
          ? Number(carrierPrice?.primaryCosting?.incrementalCost)
          : null,
        primaryIncrementStart: Number(matrixPrimary?.incrementStart)
          ? Number(matrixPrimary?.incrementStart)
          : Number(carrierPrice?.primaryCosting?.incrementStart)
          ? Number(carrierPrice?.primaryCosting?.incrementStart)
          : null,
        primaryUnitIncrement:
          matrixPrimary?.increment || carrierPrice?.primaryCosting?.increment
            ? matrixPrimary?.increment ||
              carrierPrice?.primaryCosting?.increment ||
              ""
            : null,

        secondaryPermanentDateFrom: matrixSecondaryDate?.effectiveFrom,
        secondaryTempDateFrom: matrixSecondaryDate?.effectiveBetween?.from,
        secondaryTempDateTo: matrixSecondaryDate?.effectiveBetween?.to,

        secMatrixRow: matrixSecondary?.chargeID,

        secondaryBaseCost: Number(matrixSecondary?.baseCost)
          ? Number(matrixSecondary?.baseCost)
          : null,
        secondaryFromUnit: Number(matrixSecondary?.fromParcel)
          ? Number(matrixSecondary?.fromParcel)
          : null,
        secondaryIncrementalPrice: matrixSecondary?.incrementalCost
          ? Number(matrixSecondary?.incrementalCost)
          : null,
        secondaryIncrementStart: Number(matrixSecondary?.incrementStart)
          ? Number(matrixSecondary?.incrementStart)
          : null,
        secondaryUnitIncrement: matrixSecondary?.increment
          ? matrixSecondary?.increment
          : null,
      });

      if (carrierPrice?.primaryCosting?.costingMatrix?.rows.length > 0) {
        const secondaryCostingData =
          carrierPrice?.secondaryCosting?.costingMatrix;

        carrierPrice?.primaryCosting?.costingMatrix?.rows.forEach(
          (matrix: any, index: any) => {
            if (index > 0) {
              data.push({
                pricing_method: carrierPrice?.pricingMethod,
                name: carrierPrice?.carrierName || carrierPrice.carrier,
                status: carrierPrice.active ? "Y" : "N",
                serviceDescription: carrierPrice?.serviceDescription,
                dispatch_method_description: carrierPrice?.methodDescription,
                contracts: carrierPrice.contracts,

                unit:
                  carrierPrice?.pricingMethod === "By Weight Matrix"
                    ? "KG"
                    : carrierPrice?.pricingMethod === "None"
                    ? ""
                    : "Parcel",

                matrixRow: matrix?.chargeID,

                primaryBaseCost: Number(matrix?.baseCost)
                  ? Number(matrix.baseCost)
                  : null,
                primaryFromUnit: Number(matrix?.fromParcel)
                  ? Number(matrix.fromParcel)
                  : null,
                primaryIncrementalPrice: Number(matrix?.incrementalCost)
                  ? Number(matrix.incrementalCost)
                  : null,
                primaryIncrementStart: Number(matrix?.incrementStart)
                  ? Number(matrix.incrementStart)
                  : null,
                primaryUnitIncrement: matrix?.increment
                  ? matrix?.increment
                  : null,

                secondaryPermanentDateFrom: secondaryCostingData?.form,
                secondaryTempDateFrom: secondaryCostingData?.form,
                secondaryTempDateTo: secondaryCostingData?.to,

                secMatrixRow: secondaryCostingData?.chargeID,

                secondaryBaseCost: secondaryCostingData?.rows?.[index]?.baseCost
                  ? Number(secondaryCostingData?.rows?.[index]?.baseCost)
                  : null,
                secondaryFromUnit: Number(
                  secondaryCostingData?.rows[index]?.fromParcel
                )
                  ? Number(secondaryCostingData?.rows[index]?.fromParcel)
                  : null,
                secondaryIncrementalPrice: Number(
                  secondaryCostingData?.rows?.[index]?.incrementalCost
                )
                  ? Number(secondaryCostingData?.rows[index]?.incrementalCost)
                  : null,
                secondaryIncrementStart: Number(
                  secondaryCostingData?.rows[index]?.incrementStart
                )
                  ? Number(secondaryCostingData?.rows[index]?.incrementStart)
                  : null,
                secondaryUnitIncrement: secondaryCostingData?.rows[index]
                  ?.incrementStart
                  ? secondaryCostingData?.rows[index]?.incrementStart
                  : null,
              });
            }
          }
        );
      }

      if (carrierPrice?.secondaryCosting?.costingMatrix?.rows.length > 0) {
        const secondaryCostingData =
          carrierPrice?.secondaryCosting?.costingMatrix;

        carrierPrice?.secondaryCosting?.costingMatrix?.rows.forEach(
          (matrix: any, index: any) => {
            if (
              index > 0 &&
              index >
                carrierPrice?.primaryCosting?.costingMatrix?.rows.length - 1
            )
              data.push({
                pricing_method: carrierPrice?.pricingMethod,
                name: carrierPrice?.carrierName || carrierPrice.carrier,
                status: carrierPrice.active ? "Y" : "N",
                serviceDescription: carrierPrice?.serviceDescription,
                dispatch_method_description: carrierPrice?.methodDescription,
                contracts: carrierPrice.contracts,

                unit:
                  carrierPrice?.pricingMethod === "By Weight Matrix"
                    ? "KG"
                    : carrierPrice?.pricingMethod === "None"
                    ? ""
                    : "Parcel",

                matrixRow: "",

                primaryBaseCost: null,
                primaryFromUnit: null,
                primaryIncrementalPrice: null,
                primaryIncrementStart: null,
                primaryUnitIncrement: null,

                secondaryPermanentDateFrom: null,
                secondaryTempDateFrom: null,
                secondaryTempDateTo: null,

                secMatrixRow: matrix?.chargeID,

                secondaryBaseCost: Number(matrix?.baseCost)
                  ? Number(matrix.baseCost)
                  : null,
                secondaryFromUnit: Number(matrix.fromParcel)
                  ? Number(matrix.fromParcel)
                  : null,
                secondaryIncrementalPrice: Number(matrix?.incrementalCost)
                  ? Number(matrix?.incrementalCost)
                  : null,
                secondaryIncrementStart: Number(matrix?.incrementStart)
                  ? Number(matrix.incrementStart)
                  : null,
                secondaryUnitIncrement: matrix?.incrementStart
                  ? matrix?.incrementStart
                  : null,
              });
          }
        );
      }
    });
    data = _.sortBy(data, [
      "name",
      "contracts",
      "pricing_method",
      "serviceDescription",
    ]);
    return data;
  }
};

const generateId = () =>
  Math.floor(Math.random() * 1000 + 1) + new Date().getTime();

const comparePaths = (path1: string, path2: string) => {
  // Remove trailing slashes from both paths
  const normalizedPath1 = path1.replace(/\/+$/, "");
  const normalizedPath2 = path2.replace(/\/+$/, "");

  // Compare the normalized paths
  return normalizedPath1 === normalizedPath2;
};

const goBackFromOrderEnquiryToSummary = (
  dispatch: AppDispatch,
  router: Router | NextRouter,
  orderIds: (string | number)[],
  openedTabs: INavTabs[]
) => {
  const summaryHistoryRoute = SummaryOrderHistoryPath;
  dispatch(removeTabByIds(orderIds));
  const hasSummaryHistoryOpened = openedTabs.find((d) =>
    comparePaths(d.link, summaryHistoryRoute)
  );
  if (hasSummaryHistoryOpened) {
    router.push(summaryHistoryRoute);
  } else {
    router.push(OrderAndReturnsEnquiryPath);
  }
};

const openOrderEnquiryTabs = (
  dispatch: AppDispatch,
  router: Router | NextRouter,
  orderNo: string | number
) => {
  const link = `${SummaryForOrderPath}/${orderNo}`;
  dispatch(
    addUniqueNavTab({
      id: orderNo,
      title: `Order ${orderNo}`,
      link,
    })
  );
  dispatch(
    addUniqueNavTab({
      id: orderNo,
      title: `Delivery Events ${orderNo}`,
      link: `${DeliveryEventsOrderPath}/${orderNo}`,
    })
  );
  dispatch(
    addUniqueNavTab({
      id: orderNo,
      title: `Returns Events ${orderNo}`,
      link: `${ReturnEventOrderPath}/${orderNo}`,
    })
  );

  dispatch(
    addUniqueNavTab({
      id: orderNo,
      title: `Returns Portal ${orderNo}`,
      link: `${ReturnPortalsOrderPath}/${orderNo}`,
    })
  );

  router.push(link);
};
const isValueNegative = (value: number | string) => {
  const isNegative = Number(value) < 0;
  return isNegative;
};
const valueWithCurrencySign = (value: number | string) => {
  const isNegative = isValueNegative(value);

  return `${isNegative ? "-" : ""}£${Math.abs(Number(value))}`;
};
export {
  sortAlphabetical,
  carrierPricesCSVHeaders,
  carrierPricesCSVDataConverter,
  generateId,
  comparePaths,
  goBackFromOrderEnquiryToSummary,
  openOrderEnquiryTabs,
  valueWithCurrencySign,
  isValueNegative,
};
