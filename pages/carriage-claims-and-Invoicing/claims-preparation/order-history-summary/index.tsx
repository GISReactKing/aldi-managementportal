import React, { useEffect, useState, useRef } from "react";
import HistoryTable from "./order-history-table";
import { AppButton } from "../../../../components/AppButton";
import styles from "./order-history-summary.module.scss";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { FormLabel } from "react-bootstrap";
import { Button, Typography, DatePicker } from "antd";
import { useReactToPrint } from "react-to-print";

import moment from "moment";
import { isEmpty } from "lodash";
import useTheme from "../../../../hooks/useTheme";
// import useTheme from "../../../../hooks/useTheme";

const { Title } = Typography;

interface Props {
  onGoBack?: () => void;
  onSelectedRow?: (e: any) => void;
  data?: any;
  loading: boolean;
}

const OrderHistorySummary = ({
  loading,
  onGoBack,
  onSelectedRow,
  data = [],
}: Props) => {
  const theme = useTheme();
  const claims: any = useSelector(({ claims }: RootStateOrAny) => claims.claim);
  // const theme = useTheme();
  const [claimsTableData, setClaimsTableData] = useState();

  useEffect(() => {
    const claimsData = claims?.rows?.map((claim: any) => {
      if (claim.Error) return null;
    });

    setClaimsTableData(claims);
  }, [claims]);

  const dispatch = useDispatch();

  let claimsData = claims?.rows?.map((claim: any) => {
    if (claim.Error) return claim;
    return {
      orderDate: moment(`${claim.Order_Date}`).format("DD/MM/YYYY"),
      orderNo: claim.Customer_Reference_No,
      deliveryPostCode: `${claim.PostCode_Part1} ${claim.PostCode_Part2}`,
      parcels: claim.Number_Of_Parcels,
      orderLines: claim.Number_Of_Order_Lines,
      deliveryItems: claim.Delivered_Quantity,
      deliveryValue: claim.Delivered_Value,
      deliveryStatus: claim.Delivered_Status,
      returnedItems: claim.Returned_Quantity,
      refundValue: (0).toFixed(2),
      returnsStatus: claim.Returns_Status,
      customerName: claim.Customer_Name,
    };
  });

  if (!claimsData) claimsData = [];

  const componentToPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  return (
    <div>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 text-mono-text  tracking-wide mt-5 fixed top-1 z-50"
        title="Back"
        disabled={loading}
        loading={loading}
        style={{
          borderRadius: "4px",
          right: "150px",
        }}
        onClick={onGoBack}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 text-mono-text tracking-wide mt-5 fixed top-1 right-4 z-50"
        title="Print"
        disabled={loading}
        loading={loading}
        onClick={handlePrint}
      />
      <div className="flex">
        <h1 className="text-xmd font-bold align-self-center justify-self-center w-full text-center">
          Summary Order History
        </h1>
      </div>
      <div
        className="z-0"
        id="carrier-active-dates-table"
        ref={componentToPrintRef}
      >
        <div className={`${styles.formatPrint}`}>
          <div className={`${styles.componentToPrint}`}>
            <div className="d-flex flex-column mb-4 align-items-center">
              <div className=" d-flex justify-end w-100 pr-4 mt-4">
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Title level={3}>Summary Order History</Title>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <HistoryTable
              dataSource={
                claimsData[0]?.Error || isEmpty(claimsData) ? null : claimsData
              }
              onSelectedRow={onSelectedRow}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistorySummary;
