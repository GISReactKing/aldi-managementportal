/** @format */
import React, { useState, useCallback, useRef } from "react";
import { Grid, Typography, Tag, Space } from "antd";
import styles from "./invoicing-claim.module.scss";
import { FilterFilled } from "@ant-design/icons";
import Link from "next/link";
import { ComaSeparator } from "../../../../../utils/ComaSeparator";
import { FormLabel, Table } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { AppButton } from "../../../../../components/AppButton";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { isEmpty, orderBy } from "lodash";
import useTheme from "../../../../../hooks/useTheme";

const { Text, Title } = Typography;

interface TableComponentProps {
  dataSource?: any;
  columns?: any;
  loading?: any;
  scroll?: any;
  pagination?: any;
  ellipsis?: any;
  bordered?: boolean;
  sortOrder?: any;
  rowSelection?: any;
  customerInfo?: any;
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

export function exportClaimsPreparationData() {
  /* Get the HTML data using Element by Id */
  const table: any = document.getElementById("tblStocks");

  /* Declaring array variable */
  const rows: any = [];

  const tableRows = Array.prototype.slice.call(table?.rows);

  tableRows?.map((i: any) => {
    const colspan = i?.firstChild?.getAttribute("colspan");
    const column = i.innerText.split("£").join("");
    const columnTabs = column.split("\t").join(",");

    const row = [];
    for (let i: any = 1; i <= colspan - 1; i++) {
      row.push(`,`);
    }

    if (colspan < 15) {
      rows.push([row.join("").concat(columnTabs)]);
    } else {
      rows.push([columnTabs]);
    }
  });

  let csvContent = "data:text/csv;charset=utf-8,";
  /* add the column delimiter as comma(,) and each row splitted by new line character (\n) */
  rows.forEach(function (rowArray: any) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  /* create a hidden <a> DOM node and set its download attribute */
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");

  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "claims-preparation.csv");
  document.body.appendChild(link);
  link.click();
}

// @ts-ignore
export default function TableComponent({
  dataSource,
  customerInfo,
  loading = false,
  scroll = { x: 1000 },
  pagination = { position: ["bottom"] },
  ellipsis,
  bordered = false,
  rowSelection = false,
  sortOrder = "desc",
}: TableComponentProps) {
  const theme = useTheme();
  const sortedDataSource = dataSource?.map((d: any) => ({
    type: d?.type,
    claim: orderBy(
      d.claim,
      ["carrier", "deliveryService", "consignmentNo"],
      "asc"
    ),
  }));
  const componentToPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  return (
    <>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 text-mono-text tracking-wide mt-5 position-absolute top-1 right-4 z-50"
        title="Print"
        // style={{ borderRadius: "4px", backgroundColor:theme?.primaryNight }}
        onClick={handlePrint}
      />
      <div
        className="z-0 scroll-page"
        id="claims-preparation-table"
        ref={componentToPrintRef}
      >
        <div className={`${styles.formatPrint}`}>
          <div className={`${styles.componentToPrint}`}>
            <div className="d-flex flex-column mb-4 align-items-center">
              <div className=" d-flex justify-end w-100 pr-4 mt-4">
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Title level={3}>Claims Preparation</Title>
            </div>
          </div>

          {/* hide for print */}
          <thead className={`${styles.componentToPrint}`}>
            <tr>
              <th className="fw-bold border-0">
                Customer Name: {customerInfo?.fullName}
              </th>
              <th className="fw-bold border-0"> </th>
            </tr>
            <tr>
              <th className="fw-bold border-0">
                Order Number: {customerInfo?.orderNo}
              </th>
            </tr>
            <tr>
              <th className="fw-bold border-0">
                Delivery Post Code: {customerInfo?.postCode}
              </th>
            </tr>
            <tr></tr>
          </thead>

          <Table borderless id="tblStocks" style={{ whiteSpace: "nowrap" }}>
            <thead style={{ display: "none" }}>
              <tr>
                <th className="fw-bold border-0">
                  Customer Name, {customerInfo?.fullName}
                </th>
                <th className="fw-bold border-0"> </th>
              </tr>
              <tr>
                <th className="fw-bold border-0">
                  Order Number, {customerInfo?.orderNo}
                </th>
              </tr>
              <tr>
                <th className="fw-bold border-0">
                  Delivery Post Code, {customerInfo?.postCode}
                </th>
              </tr>
              <tr></tr>
            </thead>

            <thead className={styles.singleClaimTable}>
              <tr>
                <th
                  scope="col"
                  className="title-header border-bottom-1"
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Carrier
                </th>
                <th
                  scope="col"
                  className="text-center title-header border-bottom-1"
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Delivery Service
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1"
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Consignment No
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1    "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Parcel No
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Parcel KG
                </th>
                <th
                  scope="col"
                  className="title-header  border-bottom-1 "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Date Despatched
                </th>
                <th
                  scope="col"
                  className="title-header  border-bottom-1 "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Date Returned
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  First Carrier Scan
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Date Delivery
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Latest Status
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Age Days
                </th>
                <th
                  scope="col"
                  className="title-header  border-bottom-1 "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Order Line
                </th>

                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="title-header  border-bottom-1 "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Retail Value
                </th>
                <th
                  scope="col"
                  className="title-header border-bottom-1  "
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  Product
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDataSource?.map((element: any, index: any) => {
                return (
                  <>
                    {index !== 0 && (
                      <tr className={styles.singleClaimTable}>
                        <td style={{ height: 0 }}></td>
                      </tr>
                    )}

                    <tr>
                      <td colSpan={15} className="fw-bold border-0">
                        {element.type}
                      </td>
                    </tr>

                    {element.claim?.map((item: any) => (
                      <>
                        <tr>
                          <td className={styles.clearBorder}>{item.carrier}</td>
                          <td className={styles.clearBorder}>
                            {item.deliveryService}
                          </td>
                          <td className={`${styles.clearBorder} text-right`}>
                            {item.consignmentNo}
                          </td>

                          {/*  print first parcels on the same row  */}
                          {item.parcel?.map((parcelItem: any, index: any) => {
                            let check;
                            if (
                              parcelItem.firstCarrierScan &&
                              isEmpty(parcelItem.dateDelivery)
                            ) {
                              check = true;
                            } else {
                              check = false;
                            }

                            const innerStyle = `${styles.clearBorder} ${
                              check && styles.carrierScan
                            } text-right`;

                            return (
                              <>
                                {index === 0 && (
                                  <>
                                    <td className={innerStyle}>
                                      {parcelItem.parcelNo}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.parcelKg}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.dateDispatched}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.dateReturned}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.firstCarrierScan}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.dateDelivery}
                                    </td>
                                    <td
                                      className={` ${styles.clearBorder} ${
                                        check && styles.carrierScan
                                      } text-left`}
                                    >
                                      {parcelItem.latestStatus}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.ageDays}
                                    </td>

                                    {parcelItem.order?.map(
                                      (order: any, index: any) => {
                                        return (
                                          <>
                                            {index === 0 && (
                                              <>
                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >
                                                  {order.orderLine}
                                                </td>

                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >
                                                  {order.qty}
                                                </td>
                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >{`£ ${order.retailValue}`}</td>
                                                <td
                                                  className={`${styles.clearBorder} text-left`}
                                                >
                                                  {order.product}
                                                </td>
                                              </>
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                )}
                              </>
                            );
                          })}
                        </tr>

                        {/* print parcels orders on a different row */}
                        {item.parcel?.map((parcelItem: any, index: any) => {
                          return (
                            <>
                              {index === 0 && (
                                <>
                                  {parcelItem.order?.map(
                                    (order: any, index: any) => {
                                      return (
                                        <>
                                          {index > 0 && (
                                            <>
                                              <tr>
                                                <td colSpan={11}> </td>
                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >
                                                  {order.orderLine}
                                                </td>

                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >
                                                  {order.qty}
                                                </td>
                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >{`£ ${order.retailValue}`}</td>
                                                <td
                                                  className={`${styles.clearBorder} text-left`}
                                                >
                                                  {order.product}
                                                </td>
                                              </tr>
                                            </>
                                          )}
                                        </>
                                      );
                                    }
                                  )}
                                </>
                              )}
                            </>
                          );
                        })}

                        {/* print total on a different row  */}

                        {/* print parcels orders on a different row */}
                        {item.parcel?.map((parcelItem: any, index: any) => {
                          const parcelTotal = parcelItem.order.reduce(
                            (acc: any, cur: any) => {
                              return {
                                qty: acc.qty + cur.qty,
                                retailValue:
                                  acc.retailValue + Number(cur.retailValue),
                              };
                            },
                            {
                              qty: 0,
                              retailValue: 0,
                            }
                          );

                          return (
                            <>
                              {index === 0 ? (
                                element.type === "Delivery" ? (
                                  <>
                                    <tr>
                                      <td colSpan={11}> </td>
                                      <td
                                        className={`${styles.noWrap} border-1 border-top-4`}
                                      >
                                        Parcel Total
                                      </td>
                                      <td className="border-1 border-top-4 text-right">
                                        {ComaSeparator(parcelTotal.qty)}
                                      </td>
                                      <td className="border-1 border-top-4 text-right">{`£ ${ComaSeparator(
                                        (+parcelTotal.retailValue).toFixed(2)
                                      )}`}</td>
                                      <td> </td>
                                    </tr>

                                    <tr>
                                      <td style={{ height: 20 }}></td>
                                    </tr>
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <td style={{ height: 40 }}></td>
                                    </tr>
                                  </>
                                )
                              ) : null}
                            </>
                          );
                        })}

                        {/* print least of parcels  */}
                        {item.parcel?.map((parcelItem: any, index: any) => {
                          let check;

                          const parcelIndex = index;

                          if (
                            parcelItem.firstCarrierScan &&
                            isEmpty(parcelItem.dateDelivery)
                          ) {
                            check = true;
                          } else {
                            check = false;
                          }

                          const innerStyle = `${styles.clearBorder} ${
                            check && styles.carrierScan
                          } text-right `;

                          return (
                            <>
                              {index > 0 && (
                                <>
                                  <tr>
                                    <td colSpan={3}></td>

                                    <td className={innerStyle}>
                                      {parcelItem.parcelNo}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.parcelKg}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.dateDispatched}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.dateReturned}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.firstCarrierScan}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.dateDelivery}
                                    </td>
                                    <td
                                      className={`${styles.clearBorder} ${
                                        check && styles.carrierScan
                                      } text-left`}
                                    >
                                      {parcelItem.latestStatus}
                                    </td>
                                    <td className={innerStyle}>
                                      {parcelItem.ageDays}
                                    </td>

                                    {parcelItem.order?.map(
                                      (order: any, index: any) => {
                                        return (
                                          <>
                                            {index === 0 && (
                                              <>
                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >
                                                  {order.orderLine}
                                                </td>

                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >
                                                  {order.qty}
                                                </td>
                                                <td
                                                  className={`${styles.clearBorder} text-right`}
                                                >{`£ ${order.retailValue}`}</td>
                                                <td
                                                  className={`${styles.clearBorder} text-left`}
                                                >
                                                  {order.product}
                                                </td>
                                              </>
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </tr>

                                  <>
                                    {parcelItem.order?.map(
                                      (order: any, index: any) => {
                                        return (
                                          <>
                                            {index > 0 && (
                                              <>
                                                <tr>
                                                  <td colSpan={11}> </td>
                                                  <td
                                                    className={`${styles.clearBorder} text-right`}
                                                  >
                                                    {order.orderLine}
                                                  </td>

                                                  <td
                                                    className={`${styles.clearBorder} text-right`}
                                                  >
                                                    {order.qty}
                                                  </td>
                                                  <td
                                                    className={`${styles.clearBorder} text-right`}
                                                  >{`£ ${order.retailValue}`}</td>
                                                  <td
                                                    className={`${styles.clearBorder} text-left`}
                                                  >
                                                    {order.product}
                                                  </td>
                                                </tr>
                                              </>
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </>

                                  {/* print parcels orders on a different row */}
                                  {item.parcel?.map(
                                    (
                                      parcelItem: any,
                                      index: any,
                                      array: any
                                    ) => {
                                      const parcelTotal =
                                        parcelItem.order.reduce(
                                          (acc: any, cur: any) => {
                                            return {
                                              qty: acc.qty + cur.qty,
                                              retailValue:
                                                acc.retailValue +
                                                Number(cur.retailValue),
                                            };
                                          },
                                          {
                                            qty: 0,
                                            retailValue: 0,
                                          }
                                        );

                                      return (
                                        <>
                                          {index > 0 &&
                                          index === parcelIndex ? (
                                            element.type === "Delivery" ? (
                                              <>
                                                <tr>
                                                  <td colSpan={11}> </td>
                                                  <td
                                                    className={`${styles.noWrap} border-1 border-top-4 text-right`}
                                                  >
                                                    Parcel Total
                                                  </td>
                                                  <td className="border-1 border-top-4 text-right">
                                                    {ComaSeparator(
                                                      parcelTotal.qty
                                                    )}
                                                  </td>
                                                  <td className="border-1 border-top-4 text-right">{`£ ${ComaSeparator(
                                                    (+parcelTotal.retailValue).toFixed(
                                                      2
                                                    )
                                                  )}`}</td>
                                                  <td> </td>
                                                </tr>
                                                <tr>
                                                  <td
                                                    style={{ height: 20 }}
                                                  ></td>
                                                </tr>
                                              </>
                                            ) : (
                                              <>
                                                <tr>
                                                  <td
                                                    style={{ height: 40 }}
                                                  ></td>
                                                </tr>
                                              </>
                                            )
                                          ) : null}
                                        </>
                                      );
                                    }
                                  )}
                                </>
                              )}
                            </>
                          );
                        })}
                      </>
                    ))}
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
