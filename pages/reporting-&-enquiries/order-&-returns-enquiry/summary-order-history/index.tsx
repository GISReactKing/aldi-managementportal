import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FormLabel } from "react-bootstrap";
import { Typography } from "antd";
import moment from "moment";
import HistoryTable from "./order-history-table";
import { AppButton } from "../../../../components/AppButton";
import styles from "./summary-order-history.module.scss";

const { Title } = Typography;

interface Props {
  onGoBack?: () => void;
  onSelectedRow?: (e: any) => void;
}

const SummaryOrderHistory = ({ onGoBack, onSelectedRow }: Props) => {
  const componentToPrintRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  return (
    <div>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 border-primary-sea text-mono-text  tracking-wide mt-5 fixed top-1 z-50"
        title="Back"
        style={{ borderRadius: "4px", right: 285 }}
        onClick={onGoBack}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 border-primary-sea text-mono-text  tracking-wide mt-5 fixed top-1 z-50"
        title="Export"
        style={{ borderRadius: "4px", right: 150 }}
        // onClick={onGoBack}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 border-primary-sea text-mono-text tracking-wide mt-5 fixed top-1 right-4 z-50"
        title="Print"
        onClick={handlePrint}
      />
      {/* <div className="z-0 scroll-page">
        <div
          ref={componentToPrintRef}
          className={`${styles.printTableContainer}`}
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
          </div>
          <HistoryTable onSelectedRow={onSelectedRow} pagination={false} />
        </div>
      </div> */}
      <div className="z-0 scroll-page">
        <div
          ref={componentToPrintRef}
          className={`${styles.printTableContainer}`}
        >
          <div
            className={`${styles.tableHeader} d-flex flex-column mb-4 align-items-center`}
          >
            <div className={`${styles.showOnPrint}`}>
              <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
            </div>
            <Title level={3}>Summary Order History</Title>
          </div>
          <HistoryTable onSelectedRow={onSelectedRow} pagination={false} />
        </div>
      </div>
    </div>
  );
};

export default SummaryOrderHistory;
