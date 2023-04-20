import UserDashboard from "../../../components/UserDashboard";
import CarrierCapacityTable from "../carrier-capacity-setup/CarrierCapacityTable";
import stylesMain from "../carrier-routing-control.module.scss";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Col, Row, FormLabel } from "react-bootstrap";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

import { Typography } from "antd";
import DetailEdit from "./detailEdit";
import {
  fetchCapacityLimitsList,
  SelectedRow,
  setIsEditing,
  setSelectedRow as setSelectedRowRedux,
  setSelectedCarrier,
  resetCarrierCapacitySetupState,
  setQtyLimit,
  setFormEdit,
  setEffectiveDate,
  setEffectiveBetweenDates,
  setCapacityLimits,
} from "../../../redux/slices/carrierCapacitySetupSlice";
import useAppSelector from "../../../hooks/useAppSelector";

const { Title } = Typography;

const PriceCapacity = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const capacityLimitsList = useSelector(
    ({ carrierCapacitySetup }: RootStateOrAny) =>
      carrierCapacitySetup.capacityLimitsList
  );

  const loader = useSelector(
    ({ carrierCapacitySetup }: RootStateOrAny) => carrierCapacitySetup.loader
  );

  const capacityLimitsListData = useMemo(
    () =>
      capacityLimitsList?.capacityLimitsList?.map(
        (capacityLimit: any, index: any) => {
          return {
            _id: index,
            carrier: capacityLimit.carrier,
            carrierName: capacityLimit.carrierName,
            active: capacityLimit.active === "Y" ? "Active" : "Inactive",
            primary_limit_cube: capacityLimit.primaryParameters.limitCubeM,
            primary_parcel_qty_limit: [
              capacityLimit.primaryParameters.monday,
              capacityLimit.primaryParameters.tuesday,
              capacityLimit.primaryParameters.wednesday,
              capacityLimit.primaryParameters.thursday,
              capacityLimit.primaryParameters.friday,
              capacityLimit.primaryParameters.saturday,
              capacityLimit.primaryParameters.sunday,
            ],
            secondary_limit_cube: capacityLimit.secondaryParameters.limitCubeM,
            secondary_parcel_qty_limit: [
              capacityLimit.secondaryParameters.monday,
              capacityLimit.secondaryParameters.tuesday,
              capacityLimit.secondaryParameters.wednesday,
              capacityLimit.secondaryParameters.thursday,
              capacityLimit.secondaryParameters.friday,
              capacityLimit.secondaryParameters.saturday,
              capacityLimit.secondaryParameters.sunday,
            ],
            effective_date: capacityLimit.secondaryParameters.effectiveFrom,
            effective_between_date_from:
              capacityLimit.secondaryParameters.effectiveBetween.from,
            effective_between_date_to:
              capacityLimit.secondaryParameters.effectiveBetween.to,
          };
        }
      ),
    [capacityLimitsList]
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Carrier Capacity Set Up",
  ]);
  const scroll = {
    y: "calc(100vh - 410px)",
    x: "max-content",
  };

  useEffect(() => {
    dispatch(fetchCapacityLimitsList("aldi"));
  }, []);

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });
  const {
    isEditing: isEdit,
    selectedRow,
    selectedCarrier: value,
  } = useAppSelector((state) => state.carrierCapacitySetup);
  const setSelectedRow = (data: SelectedRow | null) =>
    dispatch(setSelectedRowRedux(data));

  const setIsEdit = (bool: boolean) => dispatch(setIsEditing(bool));
  const setValue = (data: string | null) => dispatch(setSelectedCarrier(data));
  const handleRowClick = (e: any, record: any) => {
    if (selectedRow && record?._id == selectedRow?.["_id"]) {
      return setSelectedRow(null);
    }
    return setSelectedRow(record);
  };

  const handleEditRow = () => {
    dispatch(setCapacityLimits(null));
    dispatch(resetCarrierCapacitySetupState());
    dispatch(setFormEdit(false));
    dispatch(setQtyLimit([null, null, null, null, null, null, null]));
    dispatch(setEffectiveDate(null));
    dispatch(setEffectiveBetweenDates(null));

    setTimeout(() => {
      setIsEdit(!isEdit);
    }, 100);
  };

  const handleOnClear = () => {
    setSelectedRow(null);
    setValue(null);
  };

  return (
    <UserDashboard>
      <Row className="mb-3">
        <Col md="12" style={{ textAlign: "center" }}>
          <Row>
            <Title level={3}>Carrier Capacity Setup</Title>
          </Row>
        </Col>
      </Row>

      <>
        {isEdit ? (
          <>
            <DetailEdit
              detailData={selectedRow}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              setValue={setValue}
              setSelectedRow={setSelectedRow}
            />
          </>
        ) : (
          <>
            <AppButton
              className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
              title="Deselect Edit"
              style={{
                borderRadius: "4px",
                right: "285px",
              }}
              disabled={CUDDisabled || !selectedRow}
              onClick={handleOnClear}
            />
            <AppButton
              className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
              title="Edit"
              style={{ borderRadius: "4px", right: "150px" }}
              disabled={CUDDisabled || !selectedRow}
              onClick={handleEditRow}
            ></AppButton>
            <AppButton
              className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${stylesMain.buttonInHeader}`}
              title="Print"
              style={{ borderRadius: "4px" }}
              onClick={handlePrint}
            ></AppButton>

            <div
              className="z-0"
              id="active-dates-table"
              ref={componentToPrintRef}
            >
              <div className={`${stylesMain.formatPrint}`}>
                <div className={`${stylesMain.componentToPrint}`}>
                  <div className="d-flex flex-column mb-4 align-items-center">
                    <div className=" d-flex justify-end w-100 pr-4 mt-4">
                      <FormLabel>
                        {moment().format("DD/MM/YYYY HH:mm")}
                      </FormLabel>
                    </div>
                    <Title level={3}>Carrier Capacity Setup</Title>
                  </div>
                </div>
                <div
                  className="z-0 mt-2 text-nowrap"
                  id="carrier-capacity-setup-table"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CarrierCapacityTable
                    rowSelection={false}
                    pagination={false}
                    handleRowClick={handleRowClick}
                    selectedRow={selectedRow}
                    dataSource={capacityLimitsListData}
                    scroll={scroll}
                    setValue={setValue}
                    value={value}
                    loading={loader}
                    CUDDisabled={CUDDisabled}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </UserDashboard>
  );
};

export default PriceCapacity;
