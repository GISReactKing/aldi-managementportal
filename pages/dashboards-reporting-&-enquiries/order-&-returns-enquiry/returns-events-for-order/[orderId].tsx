import React from "react";
import { useRouter } from "next/router";
import UserDashboard from "../../../../components/UserDashboard";
import useAppSelector from "../../../../hooks/useAppSelector";
import { AppButton } from "../../../../components/AppButton/index";
import { Table } from "react-bootstrap";
import SummaryForOrderIdTable from "./returns-events-table";
import ReturnEventsTable from "./returns-events-table/index";
import { removeTabByIds } from "../../../../redux/slices/navTabs";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { goBackFromOrderEnquiryToSummary } from "../../../../utils/helpers";
const customerInfo = {
  fullName: "Kashaan Haider",
  orderNo: "JWTESTORDER001",
  postCode: "1HE FAKE",
  address: "99 New Road, Birmingham, B10 9YZ",
};
const SummaryForOrder = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const dispatch = useAppDispatch();
  const navTabs = useAppSelector(({ navTabs }) => navTabs.navTabs);

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
        Delivery Events: Order {orderId}
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
              Delivery Address: {customerInfo.address}
            </th>
          </tr>
        </thead>
      </Table>
      <br />

      <ReturnEventsTable />
    </UserDashboard>
  );
};

export default SummaryForOrder;
