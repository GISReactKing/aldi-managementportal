import InvoicingClaimPreparation, {
  exportClaimsPreparationData,
} from "./invoicing-claim-table";
import { AppButton } from "../../../../components/AppButton";
import { RootStateOrAny, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import styles from "./order-history-summary.module.scss";
import { isEmpty } from "lodash";
import useTheme from "../../../../hooks/useTheme";

interface Props {
  onGoBack?: () => void;
}

const InvoicingClaimsPreparation = ({ onGoBack }: Props) => {
  const scroll = {
    x: "max-content",
  };

  const theme = useTheme();

  const claimsInvoicingPreparation: any = useSelector(
    ({ claims }: RootStateOrAny) => claims.invoicingClaimPrep
  );

  console.log({ claims: claimsInvoicingPreparation?.claims });

  const [data, setData] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>({});

  useEffect(() => {
    if (claimsInvoicingPreparation?.claims) {
      const removeEmptyRecords = claimsInvoicingPreparation?.claims.filter(
        (i: any) => !isEmpty(i.claim)
      );
      setData(removeEmptyRecords);
    }
  }, [claimsInvoicingPreparation?.claims]);

  useEffect(() => {
    if (claimsInvoicingPreparation?.customerInfo) {
      setCustomerInfo(claimsInvoicingPreparation?.customerInfo);
    }
  }, [claimsInvoicingPreparation?.customerInfo]);

  return (
    <div className="claims-page">
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 text-mono-text tracking-wide mt-5 position-absolute top-1 z-50"
        title="Back"
        style={{
          borderRadius: "4px",
          right: "285px",
        }}
        onClick={onGoBack}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 text-mono-text tracking-wide mt-5 position-absolute top-1 z-50"
        title="Export"
        style={{
          borderRadius: "4px",
          right: "150px",
        }}
        onClick={exportClaimsPreparationData}
      />
      {/* <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 text-mono-text tracking-wide mt-5 position-absolute top-1 right-4 z-50"
        title="Print"
        // style={{ borderRadius: "4px" }}
        onClick={() => print()}
      /> */}
      <div className="flex flex-col">
        <h1 className="text-xmd font-bold align-self-center justify-self-center w-full text-center">
          Claims Preparation
        </h1>
        <span className="mt-1 text-center">
          Date: {moment().format("DD/MM/YYYY HH:mm")}
        </span>
      </div>
      <div id="print-claims">
        <div className="flex justify-between mt-8 px-2">
          <div className="flex flex-col">
            <h1
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              Customer:
            </h1>
            <span className="ml-3 mt-1 font-bold">
              {customerInfo?.fullName}
            </span>
            <span className="ml-3 mt-1">{customerInfo?.deliveryAddress}</span>
            <span
              style={{ color: theme?.primary }}
              className="ml-3 mt-1 underline"
            >
              {customerInfo?.email}
            </span>
            <span className="ml-3 mt-1">{customerInfo?.phoneNumber}</span>
            <span className="ml-3 mt-3 font-bold">
              Order No: {customerInfo?.orderNo}
            </span>
            <span className="ml-3 mt-1 font-bold">
              Order Date: {customerInfo?.orderDate}
            </span>
          </div>
        </div>
        <div className="mt-6" id="invoicing-claim-preparation-table">
          <InvoicingClaimPreparation
            pagination={false}
            dataSource={data}
            customerInfo={customerInfo}
            scroll={scroll}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicingClaimsPreparation;
