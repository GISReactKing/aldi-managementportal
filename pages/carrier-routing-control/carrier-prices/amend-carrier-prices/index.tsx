import React, { useState, useRef, useEffect } from "react";
import { DatePicker, Typography, Button, Form as AntForm } from "antd";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Col, Form, FormLabel, Row } from "react-bootstrap";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { isEmpty, isNumber } from "lodash";
import DataTable from "./dataTable";
import styles from "./styles.module.scss";
import stylesMain from "../../carrier-routing-control.module.scss";
import { checkingDisableOfAppButton } from "../../../../utils/CheckingStatus";
import { AppButton } from "../../../../components/AppButton";
import {
  fetchCarrierPrice,
  fetchCarrierPriceList,
  updateCapacityMatrix,
  updateCapacityParcel,
  setOnEditing,
  setPermanentlyDateData,
  setTick,
  setSecondaryParamsBestPrice,
  setEffectiveBetweenDate,
  setSecondaryData,
  setAmmendData,
  setEditKey,
  setEditSecondaryKey,
  setDisableSaveBtn,
} from "../../../../redux/slices/CarrierPriceSlice";
import { Message } from "../../../../utils/message";
import { ComaSeparator } from "../../../../utils/ComaSeparator";
import AppModal from "../../../../components/Modal";
import useTheme from "../../../../hooks/useTheme";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const dateFormat = "DD/MM/YYYY";

interface Props {
  detailData: any;

  setDetailData: any;
  setIsDetail: any;
  setValue: any;
  isDetail: any;
}

const AmendCarrierPrices = ({
  detailData,
  setDetailData,
  setIsDetail,
  setValue,
  isDetail,
}: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const carrierPriceStates = useSelector(
    ({ carrierPrice }: RootStateOrAny) => carrierPrice
  );

  const {
    carrierPrice,
    loader,
    isEditing: onEdit,
    permanentlyDateData,
    statusLoader,
    tick: onTick,
    dataSecondary,
    ammendData: data,
    editingKey,
    editingSecondaryKey,
    secondaryParametersBestPrice,
    effectiveBetweenDateData,
    disableSaveButton,
  } = carrierPriceStates;

  console.log("data secondary", dataSecondary);

  useEffect(() => {
    if (detailData?.clientMethodID) {
      dispatch(fetchCarrierPrice(detailData?.clientMethodID as number));
    }
    console.log(detailData?.clientMethodID);
  }, [detailData]);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [dateValidation, setDateValidation] = useState<boolean>(false);

  const setDataSecondary = (val: any) => dispatch(setSecondaryData(val));

  const setEditingKey = (val: any) => dispatch(setEditKey(val));

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  useEffect(() => {
    if (
      carrierPrice?.costing?.secondaryCosting?.effectiveBetween?.from &&
      carrierPrice?.costing?.secondaryCosting?.effectiveBetween?.to
    ) {
      // if (!dateData?.[1]) {
      //   if (moment(dateData).isSameOrBefore()) {
      //     setDateValidation(true);
      //   } else {
      //     setDateValidation(false);
      //   }
      // }

      // if (
      //   moment(
      //     carrierPrice?.costing?.secondaryCosting?.effectiveBetween?.from
      //   ).isSameOrBefore()
      // ) {
      //   setDateValidation(true);
      // } else {
      //   setDateValidation(false);
      // }

      setEffectiveBetweenDateData([
        moment(carrierPrice?.costing?.secondaryCosting?.effectiveBetween.from),
        moment(carrierPrice?.costing?.secondaryCosting?.effectiveBetween.to),
      ]);
    } else {
      // setEffectiveBetweenDateData(null);
    }

    if (carrierPrice?.costing?.secondaryCosting?.effectiveFrom) {
      if (
        moment(
          carrierPrice?.costing?.secondaryCosting?.effectiveFrom
        ).isSameOrBefore()
      ) {
        setDateValidation(true);
      } else {
        setDateValidation(false);
      }

      setPermanentlyDateDataFunc(
        moment(carrierPrice?.costing?.secondaryCosting?.effectiveFrom)
      );
    } else {
      // setPermanentlyDateDataFunc(null);
    }

    if (isNumber(carrierPrice?.costing?.primaryCosting?.baseCost)) {
      setPrimaryParametersBestPrice(
        carrierPrice?.costing?.primaryCosting?.baseCost
      );
    } else {
      // setPrimaryParametersBestPrice("");
    }

    if (isNumber(carrierPrice?.costing?.secondaryCosting?.baseCost)) {
      const secondaryCosting = ComaSeparator(
        !Number.isNaN(Number(carrierPrice?.costing?.secondaryCosting?.baseCost))
          ? Number(carrierPrice?.costing?.secondaryCosting?.baseCost).toFixed(2)
          : 0
      );

      setSecondaryParametersBestPrice(secondaryCosting);
      setOnTick(true);
      setDisableSaveButton(false);
    } else {
      // setSecondaryParametersBestPrice("");
      // setOnTick(false);
    }

    const primaryCostingData =
      carrierPrice?.costing?.primaryCosting?.costingMatrix?.rows.map(
        (costing: any, index: number) => {
          return {
            key: index,
            _id: costing.chargeID,
            base_price: costing.baseCost,
            from_weight: costing.fromParcel,
            increment_price: costing.incrementalCost,
            increment_start: costing.incrementStart,
            weight_increments: costing.increment,
          };
        }
      );

    const secondaryCostingData =
      carrierPrice?.costing?.secondaryCosting?.costingMatrix?.rows.map(
        (costing: any, index: number) => {
          return {
            key: index,
            _id: costing?.chargeID,
            base_price: costing?.baseCost,
            from_weight: costing?.fromParcel,
            increment_price: costing?.incrementalCost,
            increment_start: costing?.incrementStart,
            weight_increments: costing?.increment,
          };
        }
      );

    if (
      Array.isArray(primaryCostingData) &&
      primaryCostingData?.length > 0 &&
      !data?.length
    ) {
      setData(primaryCostingData);
    }
    if (
      Array.isArray(secondaryCostingData) &&
      secondaryCostingData?.length > 0 &&
      !dataSecondary?.length
    ) {
      setDataSecondary(secondaryCostingData);
    }
  }, [carrierPrice]);

  const [form] = AntForm.useForm();
  const [formSecondary] = AntForm.useForm();

  // primary parameters

  const setData = (val: any) => dispatch(setAmmendData(val));

  const [count, setCount] = useState(
    carrierPrice?.costing?.primaryCosting?.costingMatrix?.rowCount || 0
  );

  // primary secondary
  const setEditingSecondaryKey = (val: any) =>
    dispatch(setEditSecondaryKey(val));

  const setDisableSaveButton = (val: boolean) =>
    dispatch(setDisableSaveBtn(val));

  const [countSecondary, setCountSecondary] = useState(
    carrierPrice?.costing?.secondaryCosting?.costingMatrix?.rowCount || 0
  );

  const [primaryParametersBestPrice, setPrimaryParametersBestPrice] = useState<
    number | string
  >("");

  const setSecondaryParametersBestPrice = (value: number | string) =>
    dispatch(setSecondaryParamsBestPrice(value));

  const setEffectiveBetweenDateData = (value: any) =>
    dispatch(setEffectiveBetweenDate(value));

  const [disablePermanentlyDate, setDisablePermanentlyDate] =
    useState<boolean>(false);
  const [disableEffectiveBetweenDate, setDisableEffectiveBetweenDate] =
    useState<boolean>(false);

  const setOnTick = (value: boolean) => dispatch(setTick(value));

  const setOnEdit = (value: boolean) => dispatch(setOnEditing(value));

  const setPermanentlyDateDataFunc = (value: any) =>
    dispatch(setPermanentlyDateData(value));

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Carrier Prices",
  ]);

  const handleAdd = () => {
    const newData = {
      key: count,
      _id: "",
      base_price: 0,
      from_weight: 0,
      increment_price: 0,
      increment_start: 0,
      weight_increments: 0,
    };
    setData([...data, newData]);
    setCount((preState: any) => preState + 1);
    setOnEdit(true);
  };

  const handleAddSecondary = () => {
    if (Array.isArray(dataSecondary) && dataSecondary?.length) {
      let obj = dataSecondary?.[dataSecondary?.length - 1];
      if (
        !obj?.base_price &&
        !obj?.from_weight &&
        !obj?.increment_price &&
        !obj?.increment_start &&
        !obj?.weight_increments
      ) {
        Message("danger", "Please complete previous row first.");
        return;
      }
    }
    if (Array.isArray(dataSecondary) && !dataSecondary?.length) {
      setOnEdit(false);
    }
    const rowKey = Math.random();
    const newData = {
      key: rowKey,
      _id: "",
      base_price: null,
      from_weight: null,
      increment_price: null,
      increment_start: null,
      weight_increments: null,
    };

    let d = [...dataSecondary, newData];
    setDataSecondary(d);
    setCountSecondary((preState: any) => preState + 1);
    setEditingSecondaryKey(rowKey);
    setDisableSaveButton(true);
    formSecondary.setFieldsValue(newData);
  };

  const handleDatePicker = (e: any) => {
    if (Array.isArray(dataSecondary) && dataSecondary?.length) {
      let obj = dataSecondary?.[dataSecondary?.length - 1];
      if (
        !obj?.base_price &&
        !obj?.from_weight &&
        !obj?.increment_price &&
        !obj?.increment_start &&
        !obj?.weight_increments
      ) {
        console.log("defffff");
      } else {
        setDisableSaveButton(false);
      }
    }
    if (!e || e.length < 2) {
      setPermanentlyDateDataFunc(null);
      return;
    }

    setPermanentlyDateDataFunc(e);
  };

  const handleRangePicker = (e: any) => {
    if (Array.isArray(dataSecondary) && dataSecondary?.length) {
      let obj = dataSecondary?.[dataSecondary?.length - 1];
      if (
        !obj?.base_price &&
        !obj?.from_weight &&
        !obj?.increment_price &&
        !obj?.increment_start &&
        !obj?.weight_increments
      ) {
        console.log("defffff");
      } else {
        setDisableSaveButton(false);
      }
    }

    if (!e || e.length < 2) {
      setEffectiveBetweenDateData(null);
      return;
    }

    setEffectiveBetweenDateData(e);
  };

  const handleChange = (target: any) => {
    setPrimaryParametersBestPrice(target.value);
  };

  const handleChangeSecondaryParameter = (target: any) => {
    let value = target.target.value;

    const leadingDecimal = value.indexOf(".") === 0;
    const decimalPosition = value.indexOf(".");
    const lastIndexOfDecimal = value.lastIndexOf(".");
    const minusSymbolAdded = value.indexOf("-");

    // reset the field in invalid number is entered
    if (Number.isNaN(Number(value))) value = "";

    if (minusSymbolAdded > -1) value = value.replaceAll("-", "");

    if (leadingDecimal) value = "0.";

    if (decimalPosition > -1 && lastIndexOfDecimal > decimalPosition)
      value = value.slice(0, lastIndexOfDecimal);

    if (decimalPosition > -1) value = value.slice(0, decimalPosition + 3);

    setSecondaryParametersBestPrice(value);
  };

  const handleChangeSecondaryValue = () => {
    setSecondaryParametersBestPrice(
      Number(secondaryParametersBestPrice).toFixed(2)
    );
    setOnTick(true);
    setDisableSaveButton(false);
  };

  const handleChangeSecondaryValueClear = () => {
    setOnTick(false);
    setSecondaryParametersBestPrice(0);
  };

  const handleCancelButton = () => {
    setOnEdit(false);
    setPrimaryParametersBestPrice("");
    setSecondaryParametersBestPrice("");
    setPermanentlyDateDataFunc(null);
    setEffectiveBetweenDateData(null);
    setEditingSecondaryKey("");
    setOnTick(false);
    setDetailData(null);
    setValue(null);
    setData([]);
    setDataSecondary([]);
    setIsDetail(false);

    dispatch(fetchCarrierPriceList());
  };

  const onDeleteHandle = async () => {
    try {
      const statusUpdate: any = {
        clientMethodID: parseInt(carrierPrice?.costing.clientMethodID),
        clear: true,
      };

      if (
        detailData?.pricing_method === "By Parcel Simple" ||
        detailData?.pricing_method === "None"
      ) {
        await dispatch(updateCapacityParcel(statusUpdate));
      }

      if (
        detailData?.pricing_method === "By Weight Matrix" ||
        detailData?.pricing_method === "By Parcel Matrix"
      ) {
        await dispatch(updateCapacityMatrix(statusUpdate));
      }
      setData([]);
      setDataSecondary([]);
      setDisableSaveButton(true);
      setOnEdit(false);
      setEffectiveBetweenDateData(null);
      setPermanentlyDateDataFunc(null);
      handleCancelButton();
    } catch (error) {}
  };

  const handleOnSave = async () => {
    try {
      const statusUpdate: any = {
        clientMethodID: parseInt(carrierPrice?.costing.clientMethodID),
        baseCost: secondaryParametersBestPrice,
      };

      if (!effectiveBetweenDateData && !permanentlyDateData) {
        statusUpdate.clear = true;
      }

      if (effectiveBetweenDateData) {
        statusUpdate.from = moment(effectiveBetweenDateData[0]).format(
          "YYYY-MM-DD"
        );
        statusUpdate.to = moment(effectiveBetweenDateData[1]).format(
          "YYYY-MM-DD"
        );
      }

      if (permanentlyDateData) {
        statusUpdate.from = moment(permanentlyDateData).format("YYYY-MM-DD");
      }

      if (
        detailData?.pricing_method === "By Parcel Simple" ||
        detailData?.pricing_method === "None"
      ) {
        await dispatch(updateCapacityParcel(statusUpdate));
      }

      if (
        detailData?.pricing_method === "By Weight Matrix" ||
        detailData?.pricing_method === "By Parcel Matrix"
      ) {
        const rows = dataSecondary.map((costing: any) => {
          const statusRowUpdate: any = {
            fromParcel: Number(costing.from_weight),
            baseCost: Number(costing.base_price),
            incrementStart: Number(costing.increment_start),
            increment: Number(costing.weight_increments),
            incrementalCost: Number(costing.increment_price),
          };

          if (costing._id) {
            statusRowUpdate.chargeID = Number(costing._id);
          }

          return statusRowUpdate;
        });

        const statusMatrixUpdate: any = {
          clientMethodID: parseInt(carrierPrice?.costing.clientMethodID),
        };

        if (effectiveBetweenDateData) {
          statusMatrixUpdate.from = moment(effectiveBetweenDateData[0]).format(
            "YYYY-MM-DD"
          );
          statusMatrixUpdate.to = moment(effectiveBetweenDateData[1]).format(
            "YYYY-MM-DD"
          );
        }

        if (permanentlyDateData) {
          statusMatrixUpdate.from =
            moment(permanentlyDateData).format("YYYY-MM-DD");
        }

        if (rows) {
          statusMatrixUpdate.rows = rows;
        }

        if (!effectiveBetweenDateData && !permanentlyDateData) {
          statusMatrixUpdate.clear = true;
        }

        console.log({ statusMatrixUpdate });

        await dispatch(updateCapacityMatrix(statusMatrixUpdate));
      }
      setData([]);
      setDataSecondary([]);
      setDisableSaveButton(true);
      setOnEdit(false);
      setEffectiveBetweenDateData(null);
      setPermanentlyDateDataFunc(null);
      handleCancelButton();
    } catch (error) {}
  };

  useEffect(() => {
    if (
      detailData?.pricing_method === "By Parcel Simple" ||
      detailData?.pricing_method === "None"
    ) {
      if (
        (!permanentlyDateData && !effectiveBetweenDateData) ||
        secondaryParametersBestPrice === "" ||
        !secondaryParametersBestPrice ||
        Number(secondaryParametersBestPrice) <= 0 ||
        !onTick
      ) {
        setDisableSaveButton(true);
        setDisableEffectiveBetweenDate(false);
        setDisablePermanentlyDate(false);

        if (permanentlyDateData) {
          setDisableEffectiveBetweenDate(true);
          setDisablePermanentlyDate(false);
        } else if (effectiveBetweenDateData) {
          setDisableEffectiveBetweenDate(false);
          setDisablePermanentlyDate(true);
        }
      } else {
        setDisableSaveButton(true);

        if (permanentlyDateData) {
          setDisableEffectiveBetweenDate(true);
          setDisablePermanentlyDate(false);
        } else if (effectiveBetweenDateData) {
          setDisableEffectiveBetweenDate(false);
          setDisablePermanentlyDate(true);
        }
      }
    } else {
      if (
        (!permanentlyDateData && !effectiveBetweenDateData) ||
        isEmpty(dataSecondary)
      ) {
        setDisableSaveButton(true);
        setDisableEffectiveBetweenDate(false);
        setDisablePermanentlyDate(false);

        if (permanentlyDateData) {
          setDisableEffectiveBetweenDate(true);
          setDisablePermanentlyDate(false);
        } else if (effectiveBetweenDateData) {
          setDisableEffectiveBetweenDate(false);
          setDisablePermanentlyDate(true);
        }
      } else {
        // setDisableSaveButton(false);

        if (permanentlyDateData) {
          setDisableEffectiveBetweenDate(true);
          setDisablePermanentlyDate(false);
        } else if (effectiveBetweenDateData) {
          setDisableEffectiveBetweenDate(false);
          setDisablePermanentlyDate(true);
        }
      }
    }
  }, [permanentlyDateData, effectiveBetweenDateData]);

  useEffect(() => {
    if (
      (!permanentlyDateData && !effectiveBetweenDateData?.[1]) ||
      secondaryParametersBestPrice === "" ||
      !secondaryParametersBestPrice ||
      Number(secondaryParametersBestPrice) <= 0 ||
      !onTick
    ) {
      setDisableSaveButton(true);
    }
    // else if (onTick) {
    //   console.log("els if tickkkkkk", onTick);

    //   setDisableSaveButton(false);
    // }
  }, [onTick]);

  useEffect(() => {
    if (
      (!permanentlyDateData && !effectiveBetweenDateData) ||
      isEmpty(dataSecondary)
    ) {
      setDisableSaveButton(true);
    }
    // else {
    //   setDisableSaveButton(false);
    // }

    if (isEmpty(dataSecondary)) {
      setDisableSaveButton(true);
    }
  }, [dataSecondary]);

  useEffect(() => {
    if (
      detailData?.pricing_method === "By Parcel Simple" ||
      detailData?.pricing_method === "None"
    ) {
      if (onEdit) setDisableSaveButton(false);

      if (
        secondaryParametersBestPrice === "" ||
        !secondaryParametersBestPrice ||
        Number(secondaryParametersBestPrice) <= 0 ||
        !onTick
      ) {
        setDisableSaveButton(true);
      }
    } else {
      if (!permanentlyDateData && !effectiveBetweenDateData?.[1]) {
        setDisableSaveButton(true);
      }
      // else {
      //   setDisableSaveButton(false);
      // }

      if (isEmpty(dataSecondary)) {
        setDisableSaveButton(true);
      }

      if (!onEdit) {
        setDisableSaveButton(true);
      }
    }
  }, [onEdit, disableSaveButton]);

  const isMatrix =
    detailData?.pricing_method === "By Weight Matrix" ||
    detailData?.pricing_method === "By Parcel Matrix";

  return (
    <>
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
        title="Delete Parameters"
        style={{
          borderRadius: "4px",
          right: "420px",
          paddingLeft: 10,
          paddingRight: 10,
          width: 150,
        }}
        disabled={
          isMatrix
            ? isEmpty(
                carrierPrice?.costing?.secondaryCosting?.costingMatrix?.rows
              ) ||
              loader ||
              dateValidation
            : !Boolean(
                Number(carrierPrice?.costing?.secondaryCosting?.baseCost)
              ) ||
              loader ||
              dateValidation
        }
        onClick={() => setShowDeleteModal(true)}
        loading={loader || statusLoader}
      />
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
        title="Save"
        style={{ borderRadius: "4px", right: "285px" }}
        onClick={handleOnSave}
        disabled={
          disableSaveButton ||
          loader ||
          CUDDisabled ||
          (!permanentlyDateData && !effectiveBetweenDateData?.[1])
        }
        loading={loader || statusLoader}
      />
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
        title="Cancel"
        style={{ borderRadius: "4px", right: "150px" }}
        onClick={handleCancelButton}
      />
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${stylesMain.buttonInHeader}`}
        title="Print"
        style={{ borderRadius: "4px" }}
        onClick={handlePrint}
      />

      {/* Delete Modal Open */}
      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={setShowDeleteModal}
        // icon={<DeleteIconInModal />}
        onPrimaryHandle={() => onDeleteHandle()}
      >
        <h1
          style={{ color: theme?.monoLabel }}
          className="text-center text-xmd"
        >
          Delete Parameters
        </h1>
        <p
          style={{ color: theme?.mono }}
          className="mt-3 mb-3 text-center max-w-19 px-1 text-xsm leading-5"
        >
          Are you sure you want to delete the parameters?
        </p>
      </AppModal>
      <div className="z-0 scroll-page" id="users-table">
        <div
          className={`${stylesMain.printTableContainer}`}
          id="carrier-active-dates-table"
          ref={componentToPrintRef}
        >
          <div className={`${stylesMain.tableHeader}`}>
            <div className={`${styles.showOnPrint}`}>
              <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
            </div>
          </div>
          <div className={`${styles.wrapper} justify-content-center onPrint`}>
            <div>
              <Row className="mb-5 justify-content-center">
                <Col md="8">
                  <Title level={3} className="text-center">
                    Amend Carrier Prices
                  </Title>
                  <Title level={4} className="text-center mt-0">
                    Cost Type:{" "}
                    {carrierPrice ? carrierPrice?.costing?.pricingMethod : ""}
                  </Title>
                </Col>
              </Row>
              <div className="d-flex justify-between" style={{ width: "100%" }}>
                <div className="d-flex" style={{ flex: 1 }}>
                  <div className="mt-2" style={{ minWidth: "50px" }}>
                    <Text>Carrier:</Text>
                  </div>
                  <div className="d-flex mr-3">
                    <div
                      className={`${styles.valueBox} mr-5 ms-4`}
                      style={{ minWidth: 200, minHeight: 38 }}
                    >
                      <Text>
                        {statusLoader ? "" : carrierPrice?.costing?.carrier}
                      </Text>
                    </div>
                  </div>
                  <div
                    className="mt-2 mr-20 ms-4"
                    style={{ minHeight: 30, minWidth: "50px" }}
                  >
                    <Text
                      className={`${
                        false
                          ? ""
                          : carrierPrice?.costing?.active
                          ? styles.blueText
                          : styles.redText
                      }`}
                    >
                      {statusLoader
                        ? ""
                        : carrierPrice?.costing?.active === true
                        ? "Active"
                        : "Inactive"}
                    </Text>
                  </div>
                </div>

                <div className="d-flex" style={{ flex: 1 }}>
                  <div className="mt-2 mr-4">
                    <Text>Despatch Method:</Text>
                  </div>
                  <div>
                    <div>
                      <div
                        style={{ minHeight: 38 }}
                        className={`${styles.valueBox}`}
                      >
                        <Text>
                          {statusLoader
                            ? ""
                            : `${carrierPrice?.costing?.despatchMethod}: ${carrierPrice?.costing?.methodDescription}`}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`d-flex ${stylesMain.onPrint}`}>
                <div style={{ marginRight: 79 }}>
                  <div className="d-flex" style={{ marginTop: 111 }}>
                    <Title level={5}>
                      {isMatrix ? "Primary Parameters:" : "Primary Parameter:"}
                    </Title>
                    {detailData?.pricing_method === "By Weight Matrix" ||
                    detailData?.pricing_method === "By Parcel Matrix" ? (
                      <Button
                        size="small"
                        className={`${styles.buttonInContent} ${stylesMain.hideButton} tracking-wide w-20 z-50 ms-3`}
                        type="primary"
                        onClick={handleAdd}
                        disabled
                      >
                        Add Row
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-2" style={{ minWidth: 591 }}>
                    {detailData?.pricing_method === "By Weight Matrix" ||
                    detailData?.pricing_method === "By Parcel Matrix" ? (
                      <DataTable
                        setData={setData}
                        setOnEdit={setOnEdit}
                        setDisableSaveButton={setDisableSaveButton}
                        dataSource={statusLoader ? [] : data}
                        editingKey={editingKey}
                        setEditingKey={setEditingKey}
                        count={count}
                        setCount={setCount}
                        form={form}
                        primary={true}
                        loading={statusLoader}
                        pricingMethodType={detailData?.pricing_method}
                      />
                    ) : detailData?.pricing_method === "By Parcel Simple" ||
                      detailData?.pricing_method === "None" ? (
                      <div>
                        <div>
                          <Text>Base Price:</Text>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              bottom: 6,
                              marginLeft: 8,
                              marginBottom: 3,
                            }}
                          >
                            £
                          </span>
                          <Form.Control
                            className={styles.formItem}
                            name="best_price"
                            onChange={({ target }) => {
                              handleChange({ target });
                            }}
                            type="number"
                            value={
                              statusLoader
                                ? ""
                                : ComaSeparator(
                                    !Number.isNaN(
                                      Number(primaryParametersBestPrice)
                                    )
                                      ? Number(
                                          primaryParametersBestPrice
                                        ).toFixed(2)
                                      : 0
                                  )
                            }
                            style={{
                              width: 100,
                              marginTop: 5,
                              paddingLeft: 20,
                            }}
                            disabled
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="d-flex">
                    <div className="mt-4 mb-2">
                      <div className="mr-4">
                        <Text>Either: Permanently Effective From:</Text>
                        <div>
                          <DatePicker
                            showToday={false}
                            style={{
                              borderRadius: 4,
                              marginTop: 10,
                            }}
                            value={statusLoader ? null : permanentlyDateData}
                            onChange={(e) => {
                              handleDatePicker(e);
                              setOnEdit(true);
                            }}
                            format={dateFormat}
                            disabled={
                              disablePermanentlyDate ||
                              detailData?.pricing_method === "None"
                            }
                            disabledDate={(current) => {
                              let customDate = moment().add(0, "days");
                              return (
                                current &&
                                current < moment(customDate, "YYYY-MM-DD")
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 mb-2 ">
                      <div>
                        <Text>Or: Effective Between:</Text>
                        <div>
                          <RangePicker
                            style={{ borderRadius: 4, marginTop: 10 }}
                            value={
                              statusLoader ? null : effectiveBetweenDateData
                            }
                            format={dateFormat}
                            disabled={
                              disableEffectiveBetweenDate ||
                              detailData?.pricing_method === "None"
                            }
                            onChange={(e) => {
                              if (!e) {
                                handleRangePicker(e);
                                setOnEdit(true);
                                return;
                              }

                              if (e) {
                                const [startDate, endDate] = e;

                                if (moment(startDate).isSame(endDate)) {
                                  handleRangePicker([startDate, null]);
                                  Message(
                                    "danger",
                                    "End date must be greater than start date"
                                  );
                                  return;
                                }

                                handleRangePicker(e);
                                setOnEdit(true);
                              }
                            }}
                            disabledDate={(current) => {
                              let customDate = moment().add(0, "days");
                              return (
                                current &&
                                current < moment(customDate, "YYYY-MM-DD")
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div>
                      <div>
                        <div className="d-flex">
                          <Title level={5}>
                            {isMatrix
                              ? "Secondary Parameters:"
                              : "Secondary Parameter:"}
                          </Title>

                          {detailData?.pricing_method === "By Weight Matrix" ||
                          detailData?.pricing_method === "By Parcel Matrix" ? (
                            <Button
                              size="small"
                              className={`${styles.buttonInContent} ${stylesMain.hideButton} tracking-wide w-20 z-50 ms-3`}
                              type="primary"
                              onClick={handleAddSecondary}
                              disabled={
                                !permanentlyDateData &&
                                !effectiveBetweenDateData?.[1]
                              }
                            >
                              Add Row
                            </Button>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-2">
                        {detailData?.pricing_method === "By Weight Matrix" ||
                        detailData?.pricing_method === "By Parcel Matrix" ? (
                          <DataTable
                            setData={setDataSecondary}
                            setOnEdit={setOnEdit}
                            dataSource={statusLoader ? [] : dataSecondary}
                            setDisableSaveButton={setDisableSaveButton}
                            editingKey={editingSecondaryKey}
                            setEditingKey={setEditingSecondaryKey}
                            count={countSecondary}
                            setCount={setCountSecondary}
                            form={formSecondary}
                            loading={statusLoader}
                            pricingMethodType={detailData?.pricing_method}
                            selectedDate={
                              !permanentlyDateData &&
                              !effectiveBetweenDateData?.[1]
                            }
                          />
                        ) : detailData?.pricing_method === "By Parcel Simple" ||
                          detailData?.pricing_method === "None" ? (
                          <div>
                            <div>
                              <Text>Base Price:</Text>
                            </div>
                            <div
                              style={{
                                position: "absolute",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 6,
                                  marginLeft: 8,
                                  marginBottom: 3,
                                }}
                              >
                                £
                              </span>
                              <Form.Control
                                className={styles.formItem}
                                name="best_price"
                                onChange={({ target }) => {
                                  handleChangeSecondaryParameter({ target });
                                  setOnTick(false);
                                  // setOnEdit(true);
                                }}
                                required
                                type="text"
                                inputMode="decimal"
                                value={
                                  statusLoader || !secondaryParametersBestPrice
                                    ? ""
                                    : secondaryParametersBestPrice
                                }
                                style={{
                                  width: 100,
                                  marginTop: 5,
                                  paddingLeft: 20,
                                  borderColor:
                                    Number(secondaryParametersBestPrice) <= 0 &&
                                    secondaryParametersBestPrice
                                      ? "red"
                                      : "#ced4da",
                                }}
                                disabled={
                                  !permanentlyDateData &&
                                  !effectiveBetweenDateData?.[1]
                                }
                              />

                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 6,
                                  marginLeft: 128,
                                  marginBottom: 3,
                                  display:
                                    !permanentlyDateData &&
                                    !effectiveBetweenDateData?.[1]
                                      ? "none"
                                      : "block",
                                }}
                              >
                                {!statusLoader ? (
                                  <>
                                    {!onTick ? (
                                      <CheckCircleOutlined
                                        style={{
                                          color:
                                            Number(
                                              secondaryParametersBestPrice
                                            ) <= 0 ||
                                            !secondaryParametersBestPrice
                                              ? "grey"
                                              : "#1890ff",
                                          display:
                                            Number(
                                              secondaryParametersBestPrice
                                            ) <= 0 ||
                                            !secondaryParametersBestPrice
                                              ? "none"
                                              : "block",
                                        }}
                                        onClick={handleChangeSecondaryValue}
                                        disabled={
                                          !(
                                            Number(
                                              secondaryParametersBestPrice
                                            ) <= 0 ||
                                            !secondaryParametersBestPrice
                                          )
                                        }
                                      />
                                    ) : (
                                      <CloseCircleOutlined
                                        onClick={
                                          handleChangeSecondaryValueClear
                                        }
                                      />
                                    )}
                                  </>
                                ) : null}
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AmendCarrierPrices;
