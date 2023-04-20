import React from "react";
import { useRouter } from "next/router";
import UserDashboard from "../../../../components/UserDashboard";
import useAppSelector from "../../../../hooks/useAppSelector";
import { AppButton } from "../../../../components/AppButton/index";
import styles from "../order-and-returns-enquiry.module.scss";
import { Table } from "react-bootstrap";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { goBackFromOrderEnquiryToSummary } from "../../../../utils/helpers";
import ReturnPortalTable from "./returns-portal-table";
const customerInfo = {
  fullName: "John Jones",
  orderNo: "5223595",
  returnID: "00988678",
  deliveryAddess: "99 New Road, Birmingham, B10 9YZ",
  returnPortalDate: "21/07/2021 07:40",
};

const data = [
  {
    orderLine: "Small Iterms 1",
    product: "9001: Small Items",
    returnItems: "1",
    refundValue: "$5.60",
    returnReason: "NP Not as photo/description",
    statusDate: "21/07/2021 07:40",
    returnsStatus: "pending Collection",
    returnMethod: "Reyal Mail Collection",
    deliveredBy: "Hermes",
  },
];

const SummaryForOrder = () => {
  const router = useRouter();
  const navTabs = useAppSelector(({ navTabs }) => navTabs.navTabs);
  const { orderId } = router.query;
  const dispatch = useAppDispatch();

  return (
    <UserDashboard>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 border-primary-sea text-mono-text  tracking-wide mt-5 fixed top-1 z-50"
        title="Back"
        style={{ borderRadius: "4px", right: 285 }}
        onClick={() =>
          goBackFromOrderEnquiryToSummary(
            dispatch,
            router,
            [String(orderId)],
            navTabs
          )
        }
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
        // onClick={handlePrint}
      />
      <h1
        data-testId="CustomerEnquiry"
        className="text-mono-title font-bold flex justify-center text-xmd"
      >
        Returns Portal: Pending Returns
      </h1>
      <br />
      <br />

      <Table style={{ whiteSpace: "nowrap" }}>
        <thead>
          <tr>
            <th className="fw-bold border-0">{customerInfo?.fullName}</th>
            <th className="fw-bold border-0"> </th>
          </tr>
          <tr>
            <th className="border-0 font-normal">
              Delivery Address: {customerInfo.deliveryAddess}
            </th>
          </tr>
          <br />
          <tr>
            <th className="border-0 font-normal">
              Order No.: {customerInfo?.orderNo}
            </th>
          </tr>
          <tr>
            <th className="border-0 font-bold">
              Returns ID: {customerInfo?.returnID}: Order Part Delivered
            </th>
          </tr>
          <tr>
            <th className="border-0 font-bold">
              Returns Portal Date: {customerInfo?.returnPortalDate}: Order Part
              Delivered
            </th>
          </tr>
        </thead>
      </Table>
      <br />

      <ReturnPortalTable />
    </UserDashboard>
  );
};

export default SummaryForOrder;
