import { Col, Form, FormLabel, Row } from "react-bootstrap";
import styles from "./multi-box-products.module.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InfinityTable } from "antd-table-infinity";
import UserTable from "../../../components/Tables/UserTable";

import UserDashboard from "../../../components/UserDashboard";
import { Button, Radio, Space, Typography, Table, Spin, Checkbox } from "antd";
import ExceptionWarringModal from "../../../components/CustomModal";
import { WarningOutlined } from "@ant-design/icons";
import MultiBoxProductTable from "../../../components/Tables/multibox-routing";
import MultiBoxProductsView from "./multi-box-products-grid-view";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import {
  fetchMultiBoxRoutingConfiguration,
  fetchMultiBoxExceptionSkus,
  configureMultiBoxRouting,
} from "../../../redux/slices/multiBoxProductsRoutingSlice";
import { fetchSkus } from "../../../redux/slices/productFixedRoutingDespatch";
import { IRequest, ISkuListRow } from "../../../redux/types/multi-box";
import { Message } from "../../../utils/message";
import isBoolean from "lodash/isBoolean";
import { client } from "../../../constants";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import ClearModal from "../../../components/Modals/ProductFixedRoutingDespatch/ClearModal";
import useTheme from "../../../hooks/useTheme";

// import { useReactToPrint } from "react-to-print";
const { Title } = Typography;

const radioButtons = {
  sameCarrier: "Route All Multi Box Components via the same carrier",
  oneOrMoreCarriers:
    "Route by the one or more carriers, that best suits each component",
};

const skusColumns = [
  {
    title: "SKU Code",
    dataIndex: "Item_Code",
    key: "Item_Code",
    width: 80,
  },
  {
    title: "Item Description",
    dataIndex: "Item_Description",
    key: "Item_Description",
    width: 140,
  },
];

const MultiBoxProductsRouting = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isModal, setIsModal] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [radioCheckedValue, setRadioCheckedValue] = useState<string>("");
  const [exception, setException] = useState<string>("");

  const [popUpShow, setPopUpShow] = useState(false);
  const [showGridViewModal, setShowGridViewModal] = useState(false);
  const [selectedSku, setSelectedSku] = useState<ISkuListRow>();
  const [selectedSkus, setSelectedSkus] = useState<ISkuListRow[]>([]);
  const [disableSelectSku, setDisableSelectSku] = useState<boolean>(false);
  const [enteredSkuCode, setEnteredSkuCode] = useState("");
  const [edit, setEdit] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [show, setShow] = useState(false);
  // const [scroll, setScroll] = useState<any>({
  //   x: "max-content",
  //   y: 420,
  // });
  const scroll = {
    x: "max-content",
    y: 420,
  };

  const [selectedRecords, setSelectedRecords] = useState<ISkuListRow[]>([]);

  const tableToPrint = useRef(null);

  const handleUseReactToPrint = useReactToPrint({
    content: () => tableToPrint.current,
  });
  const handlePrint = () => {
    // setScroll({});
    handleUseReactToPrint();
  };

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );
  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Multi Box Products: Routing",
  ]);

  const multiBoxExceptionSkus: ISkuListRow[] =
    useSelector(
      ({ multiBoxProductsRouting }: RootStateOrAny) =>
        multiBoxProductsRouting.multiBoxExceptionSkus
    ) || [];

  const skusToChoseFrom: ISkuListRow[] = useSelector(
    ({ multiBoxProductsRouting }: RootStateOrAny) =>
      multiBoxProductsRouting.multiBoxSkuList
  );

  // set the initial list to the set of skus to choose from
  const [filteredSkus, setFilteredSkus] = useState<ISkuListRow[]>([]);

  const sameKitCarrier = useSelector(
    ({ multiBoxProductsRouting }: RootStateOrAny) =>
      multiBoxProductsRouting.sameKitCarrier
  );

  const multiBoxLoading = useSelector(
    ({ multiBoxProductsRouting }: RootStateOrAny) =>
      multiBoxProductsRouting.loading
  );

  const componentExceptionSkus = useSelector(
    ({ multiBoxProductsRouting }: RootStateOrAny) =>
      multiBoxProductsRouting.componentExceptionSkus
  );

  function sortSkus(skuList: ISkuListRow[]) {
    return skuList.sort((a: ISkuListRow, b: ISkuListRow) =>
      a.Item_Description.localeCompare(b.Item_Description)
    );
  }

  function clearErrorAndInfo() {
    setError("");
    setInfo("");
  }

  // sort selected skus by sku description
  useEffect(() => {
    if (selectedSkus?.length) {
      const sortedSkus = sortSkus([...selectedSkus]);
      setSelectedSkus(sortedSkus);
    }
  }, [selectedSkus?.length]);

  useEffect(() => {
    // load default for Order Line
    dispatch(
      fetchMultiBoxRoutingConfiguration({
        client,
      })
    );

    // load exception skus
    dispatch(
      fetchMultiBoxExceptionSkus({
        client,
      })
    );

    // return () => {
    //   dispatch(resetMultiBoxState());
    // };
  }, []);

  // set default for Order Line
  useEffect(() => {
    if (sameKitCarrier) {
      setRadioCheckedValue(radioButtons.sameCarrier);
      setException(radioButtons.oneOrMoreCarriers);

      return;
    }
    setRadioCheckedValue(radioButtons.oneOrMoreCarriers);
    setException(radioButtons.sameCarrier);
  }, [sameKitCarrier]);

  useEffect(() => {
    if (Array.isArray(skusToChoseFrom)) {
      setFilteredSkus(skusToChoseFrom);
      return;
    }
    setFilteredSkus([]);
  }, [skusToChoseFrom]);

  // disable select sku till the change in same carrier
  // has been saved
  useEffect(() => {
    const globalSameCarrier = radioCheckedValue === radioButtons.sameCarrier;

    // if global same carrier is changed,
    //

    if (globalSameCarrier !== sameKitCarrier) {
      //list all skus as available for selection as exception skus
      setFilteredSkus([...multiBoxExceptionSkus, ...skusToChoseFrom]);

      // clear selected exceptions
      setSelectedSkus([]);
    }
  }, [exception]);

  useEffect(() => {
    // set the current list of exceptions skus
    if (multiBoxExceptionSkus.length > 0) {
      const sortedSkus = sortSkus([...multiBoxExceptionSkus]);
      setSelectedSkus(sortedSkus);
      return;
    }

    setSelectedRecords([]);
    setSelectedSku(undefined);
    setSelectedSkus([]);
  }, [multiBoxExceptionSkus]);

  useEffect(() => {
    if (selectedSku) {
      setEnteredSkuCode(selectedSku.Item_Code);
      return;
    }

    setEnteredSkuCode("");
  }, [selectedSku?.Item_Code]);

  const loadMoreContent = () => (
    <div
      style={{
        textAlign: "center",
        paddingTop: 40,
        paddingBottom: 40,
        border: "1px solid #e8e8e8",
      }}
    >
      <Spin tip="Loading..." />
    </div>
  );

  const handleSameKitCarrierFlagChange = (e: any) => {
    setIsModal(true);
    setRadioCheckedValue(e.target.value);
  };

  const onChangeSku = ({ target }: any) => {
    // clear error messages if any
    clearErrorAndInfo();

    if (target.value == "") {
      setPopUpShow(false);
      setEnteredSkuCode("");
      setSelectedSku(undefined);
      return;
    }

    const filteredSkus = skusToChoseFrom.filter(
      (sku: ISkuListRow) =>
        sku.Item_Code?.toLowerCase().includes(target.value?.toLowerCase()) ||
        sku.Item_Description?.toLowerCase().includes(
          target.value?.toLowerCase()
        )
    );

    setFilteredSkus(filteredSkus);
    setPopUpShow(true);
    setEnteredSkuCode(target.value);
  };

  const handleRemoveSku = async () => {
    if (!selectedRecords.length) {
      return;
    }

    // remove the selected sku from the list
    setSelectedSkus((prevState) => {
      const itemsToRemove = selectedRecords.map((item) => item.Item_Code);

      const updatedState = prevState.filter(
        (sku) => !itemsToRemove.includes(sku.Item_Code)
      );
      return updatedState;
    });
    setChangesMade(true);
    setSelectedRecords([]);
  };

  const handleAddSku = async () => {
    if (!selectedSku) {
      return false;
    }

    const exists = selectedSkus.find(
      (sku) => sku.Item_Code === selectedSku.Item_Code
    );

    if (exists) {
      setError(
        `${selectedSku.Item_Code}:${selectedSku.Item_Description} has already been added.`
      );

      return;
    }
    // add the selected sku to the list
    setSelectedSkus((prevState) => [...prevState, selectedSku]);
    setChangesMade(true);
    setSelectedSku(undefined);
    setInfo(
      `${selectedSku.Item_Code}:${selectedSku.Item_Description} has been added successfully.`
    );
  };

  const onConfirm = () => {
    const exception =
      radioCheckedValue === radioButtons.sameCarrier
        ? radioButtons.oneOrMoreCarriers
        : radioButtons.sameCarrier;

    setException(exception);

    setIsModal(false);

    // set that changes have been made
    setChangesMade(true);
  };

  const handleCancelModal = () => {
    setIsModal(false);
    const checkedValue =
      exception === radioButtons.sameCarrier
        ? radioButtons.oneOrMoreCarriers
        : radioButtons.sameCarrier;
    setRadioCheckedValue(checkedValue);
  };

  const handleSaveChanges = async () => {
    // change button text to show save
    if (!edit) {
      setEdit((prev) => !prev);
      return;
    }

    // changes
    let changes: IRequest = {
      client,
    };

    // check if client's same carrier flag has been changed
    const globalSameCarrier = radioCheckedValue === radioButtons.sameCarrier;

    const sameCarrier =
      sameKitCarrier !== globalSameCarrier ? globalSameCarrier : undefined;

    // if global same carrier is changed, send listed exceptions
    if (isBoolean(sameCarrier)) {
      // get sku codes from the selected skus
      const skuListToAdd = selectedSkus.map((sku) => sku.Item_Code);

      changes = {
        ...changes,
        sameCarrier,
      };

      if (skuListToAdd?.length) {
        changes = {
          ...changes,
          skuListToAdd,
        };
      }
    }

    // if global same carrier config has not changed
    if (!isBoolean(sameCarrier) && !sameCarrier) {
      // prepare the list of exceptions to be added
      const existingExceptions = multiBoxExceptionSkus.map(
        (sku) => sku.Item_Code
      );

      const skuListToAdd = selectedSkus
        .filter((sku) => !existingExceptions.includes(sku.Item_Code))
        .map((sku) => sku.Item_Code);

      if (skuListToAdd?.length)
        changes = {
          ...changes,
          skuListToAdd,
        };

      // skus to remove

      const listOfSelectedSkus = selectedSkus.map((sku) => sku.Item_Code);

      const skuListToRemove = multiBoxExceptionSkus
        .filter((sku) => !listOfSelectedSkus.includes(sku.Item_Code))
        .map((sku) => sku.Item_Code);

      if (skuListToRemove?.length)
        changes = {
          ...changes,
          skuListToRemove,
        };
    }

    // if there are not changes, return
    if (!(Object.keys(changes).length > 1)) {
      Message("info", "No changes made. Please check!");
      return;
    }

    // save changes
    try {
      await dispatch(configureMultiBoxRouting(changes) as any);
      // load default for Order Line

      await dispatch(
        fetchMultiBoxRoutingConfiguration({
          client,
        }) as any
      );

      // load exception skus
      await dispatch(
        fetchMultiBoxExceptionSkus({
          client,
        }) as any
      );

      // enable gride to be shown
      setChangesMade(false);
      Message("success", "Changes have been saved successfully.");
      clearErrorAndInfo();
    } catch (error) {
      Message(
        "danger",
        (error as any)?.message ||
          "Your requested have not been saved. Please try again later"
      );
    }
  };

  function updateSelectedSkus({
    record,
    e,
  }: {
    record: ISkuListRow;
    e: CheckboxChangeEvent;
  }) {
    // if checked added item to selectedRecords to be removed
    if (e.target.checked) {
      setSelectedRecords((prev) => [...prev, record]);
      return;
    }

    // if unchecked remove item from selectedRecords
    setSelectedRecords((prev) =>
      prev.filter((item) => item.Item_Code !== record.Item_Code)
    );
  }

  const columns = [
    {
      title: "SKU Specific Exceptions",
      dataIndex: "Item_Code",
      key: "Item_Code",
      width: 350,
      render: (value: string, record: ISkuListRow) => {
        return <span>{`${record.Item_Code}: ${record.Item_Description}`}</span>;
      },
    },
    {
      align: "right",
      title: "Component",
      dataIndex: "component",
      key: "component",
      width: 100,
      render: (value: string, record: ISkuListRow) => {
        return <span>{`${record.Component_Count}`}</span>;
      },
    },
    {
      title: <span className={styles.columnHeader}>Remove</span>,
      showSorterTooltip: false,
      dataIndex: "remove",
      key: "remove",
      width: 80,
      render: (item: string, record: ISkuListRow) => {
        const checked = selectedRecords.some(
          (sku) => sku.Item_Code === record.Item_Code
        );
        return (
          <Checkbox
            disabled={!edit}
            onChange={(e) => updateSelectedSkus({ record, e })}
            checked={checked}
          />
        );
      },
      align: "center",
      className: `${styles.hideColumnOnPrint}`,
    },
  ];

  return (
    <UserDashboard>
      {!showGrid && (
        <>
          {edit ? (
            <AppButton
              className="xsm:w-28 xsm:h-9 lg:h-10 lg:w-30 border-0  font-bold tracking-wide mt-5"
              style={{
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                right: 305,
              }}
              onClick={() => setEdit((prev) => !prev)}
              title={"Cancel"}
            />
          ) : null}
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:h-10 lg:w-30 border-0 font-bold tracking-wide mt-5 position-absolute top-1 right-40 z-50"
            onClick={handleSaveChanges}
            title={edit ? "Save" : "Edit"}
            loading={multiBoxLoading}
            disabled={multiBoxLoading || (edit && !changesMade) || CUDDisabled}
          />
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 right-4 z-50"
            onClick={handlePrint}
            title="Print"
            loading={multiBoxLoading}
            disabled={multiBoxLoading}
          />
          <Row className="mb-3">
            <Col md="12" style={{ textAlign: "center" }}>
              <Row>
                <Title level={3}>Multi Box Products: Routing</Title>
              </Row>
            </Col>
          </Row>
          <div className="mt-8">
            <Row>
              <Col md={1} lg={1}></Col>
              <Col md={5} lg={5}>
                <span>
                  <h4
                    style={{ color: theme?.mono }}
                    className="text-sm font-normal"
                  >
                    Applicable to all Multi Box Products, not listed as SKU
                    specific exception:
                  </h4>
                  <p
                    style={{ color: theme?.mono }}
                    className="text-sm font-normal mt-2 ml-2"
                  >
                    <p>For an Order Line:</p>
                    <Radio.Group
                      onChange={handleSameKitCarrierFlagChange}
                      value={radioCheckedValue}
                      disabled={!edit}
                      className="ml-4 mt-2"
                    >
                      <Space direction="vertical">
                        <Radio
                          value={
                            "Route All Multi Box Components via the same carrier"
                          }
                        >
                          Route All Multi Box Components via the same carrier
                        </Radio>
                        <Radio
                          value={
                            "Route by the one or more carriers, that best suits each component"
                          }
                        >
                          Route by the one or more carriers, that best suits
                          each component
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </p>
                  <br />
                  <p
                    style={{ color: theme?.mono }}
                    className="text-sm font-normal"
                  >
                    SKU Specific Exceptions:
                  </p>
                  <span
                    style={{ color: "#0c13db", fontStyle: "italic" }}
                    className="ml-6 mt-1"
                  >
                    {exception}
                  </span>
                  <Form>
                    <Row className={`${styles.createUserFormRow}`}>
                      <Col md={12} className="position-relative">
                        <div
                          className="sku-popup position-absolute"
                          style={{
                            zIndex: 999,
                            top: "50px",
                            left: "35px",
                            borderColor: "#b9b9b9",
                            borderStyle: "double",
                            borderWidth: 1,
                            width: 430,
                          }}
                          hidden={!popUpShow}
                        >
                          <InfinityTable
                            onRow={(record: ISkuListRow, rowIndex: number) => {
                              return {
                                onClick: () => {
                                  setSelectedSku(record);

                                  setPopUpShow(false);
                                },
                              };
                            }}
                            pageSize={100}
                            loadingIndicator={loadMoreContent()}
                            rowKey={"Item_Code"}
                            size={"small"}
                            loading={!filteredSkus.length}
                            bordered={true}
                            pagination={false}
                            columns={skusColumns}
                            dataSource={filteredSkus}
                            scroll={{ y: "200px" }}
                          />
                        </div>
                        <Form.Group
                          className="mr-5 ml-6 flex flex-col "
                          controlId="value_name"
                        >
                          <span>
                            <Row className="d-flex align-items-center">
                              <Col md={5}>
                                <Form.Control
                                  style={{ width: "200px" }}
                                  className={styles.inputFiledStyle}
                                  maxLength={40}
                                  name="value_name"
                                  placeholder="Enter Search Characters"
                                  value={enteredSkuCode}
                                  disabled={disableSelectSku || !edit}
                                  onChange={onChangeSku}
                                />
                              </Col>
                              <Col
                                md={7}
                                className="mt-2 d-flex align-items-center"
                              >
                                <Form.Label
                                  style={{
                                    marginTop: "7px",
                                    textAlign: "right",
                                  }}
                                >
                                  {multiBoxLoading ? (
                                    <>
                                      <Spin
                                        //@ts-ignore
                                        tip={
                                          <span className="inline-block ml-2">
                                            Please wait loading skus ...
                                          </span>
                                        }
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      />
                                    </>
                                  ) : (
                                    <span>{selectedSku?.Item_Description}</span>
                                  )}
                                </Form.Label>
                              </Col>
                            </Row>
                          </span>
                          <span className="h-12 mb-2 w-full flex justify-between ">
                            <div>
                              <Button
                                className={`${styles.buttonInContent} border-0 tracking-wide  mt-3 z-50`}
                                type="primary"
                                style={{
                                  background: !selectedSku
                                    ? "#d7ebf3"
                                    : "#A7CBF2",
                                  borderRadius: "4px",
                                  color: "#2c7d8d",
                                }}
                                onClick={handleAddSku}
                                disabled={!selectedSku}
                              >
                                Add
                              </Button>
                              <Button
                                className={`${styles.buttonInContent} tracking-wide bg-primary-sea mt-3 ml-2 border-0 z-50`}
                                type="primary"
                                style={{
                                  background:
                                    disableSelectSku || !selectedRecords.length
                                      ? "#ddeff4"
                                      : "#A7CBF2",
                                  borderRadius: "4px",
                                  color: "#2c7d8d",
                                }}
                                onClick={handleRemoveSku}
                                disabled={
                                  disableSelectSku || !selectedRecords.length
                                }
                              >
                                Remove
                              </Button>
                              <Button
                                className={`${styles.buttonInContent} tracking-wide bg-primary-sea mt-3 ml-2 border-0 z-50`}
                                type="primary"
                                style={{
                                  background:
                                    selectedSkus?.length && edit
                                      ? "#A7CBF2"
                                      : "#ddeff4",
                                  borderRadius: "4px",
                                  color: "#2c7d8d",
                                }}
                                onClick={() => {
                                  setShow(true);
                                }}
                                disabled={!edit || disableSelectSku}
                              >
                                Clear
                              </Button>
                            </div>
                            <Button
                              className=" font-bold tracking-wide bg-primary-sea mt-3 border-0  border-0 z-50 "
                              type="primary"
                              style={{
                                background: "#274366",
                                borderRadius: "4px",
                                // color: !edit ? "#7a95ad" :theme?.white,
                                color: theme?.white,
                              }}
                              onClick={() => {
                                if (changesMade) {
                                  setShowGridViewModal(true);
                                  return;
                                }
                                setShowGrid(true);
                              }}
                              disabled={!selectedSkus.length}
                            >
                              Show Grid View
                            </Button>
                          </span>
                          {error ? (
                            <span className=" text-danger">{error}</span>
                          ) : null}
                          {/* {info ? (
                            <span className=" text-success">{info}</span>
                          ) : null} */}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                  <ExceptionWarringModal
                    onCloseModal={handleCancelModal}
                    showModal={isModal}
                  >
                    <div className="p-3 flex justify-center flex-col">
                      <WarningOutlined className="text-xlg text-center" />
                      <p className="text-md mt-4">
                        The List of SKU Specific Exceptions will be erased
                      </p>
                    </div>
                    <div className="flex justify-center p-4">
                      <AppButton
                        className="xsm:h-9 lg:h-10 lg:w-30 mr-2  font-bold tracking-wide  z-50"
                        type="outlined"
                        style={{
                          background: theme?.primaryNight,
                          borderRadius: "4px",
                        }}
                        onClick={handleCancelModal}
                        title="Cancel"
                      />

                      <AppButton
                        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 ml-2 font-bold tracking-wide bg-primary border-0  z-50"
                        style={{
                          background: theme?.primaryNight,
                          borderRadius: "4px",
                        }}
                        onClick={onConfirm}
                        title="Confirm"
                      />
                    </div>
                  </ExceptionWarringModal>
                  <ExceptionWarringModal
                    onCloseModal={() => setShowGridViewModal(false)}
                    showModal={showGridViewModal}
                  >
                    <div className="p-3 flex justify-center flex-col">
                      <WarningOutlined className="text-xlg text-center" />
                      <p className="text-md mt-4">
                        The changes you have made will be lost.
                        <br />
                        <br />
                        Please click the Save button to save your changes before
                        continuing.
                      </p>
                    </div>
                    <div className="flex justify-center p-4">
                      <Button
                        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 ml-2 font-bold tracking-wide bg-primary-sea border-0  z-50"
                        type="primary"
                        style={{
                          background: theme?.primaryNight,
                          borderRadius: "4px",
                        }}
                        onClick={() => setShowGridViewModal(false)}
                      >
                        Ok
                      </Button>
                    </div>
                  </ExceptionWarringModal>
                </span>
              </Col>
              <Col md={5} lg={5}>
                <div className="z-0 scroll-page" id="users-table">
                  <div
                    className={`${styles.printTableContainer}`}
                    ref={tableToPrint}
                  >
                    <div className={`${styles.tableHeader}`}>
                      <div className={`${styles.showOnPrint}`}>
                        <FormLabel>
                          {moment().format("DD/MM/YYYY HH:mm")}
                        </FormLabel>
                      </div>
                      <Row>
                        <Col md="12" style={{ textAlign: "center" }}>
                          <Row>
                            <Title level={3} className="mb-0">
                              Multi Box Products: SKU Specific Exceptions
                            </Title>
                          </Row>
                        </Col>
                      </Row>
                      <h4
                        style={{ color: theme?.mono }}
                        className="text-sm text-center font-medium"
                      >
                        {exception}
                      </h4>
                    </div>
                    <div className={`${styles.hideTable} ${styles.printWidth}`}>
                      <UserTable
                        rowSelection={false}
                        columns={columns}
                        dataSource={selectedSkus}
                        pagination={false}
                        scroll={{ x: 700 }}
                      />
                    </div>
                    <div className={`${styles.showTable}`}>
                      <MultiBoxProductTable
                        id="multi-box-product-table"
                        className={`${styles.multiBoxProductTable}`}
                        rowSelection={false}
                        columns={columns}
                        dataSource={selectedSkus}
                        pagination={false}
                        bordered={true}
                        scroll={scroll}
                        setSelectedRecord={setSelectedRecords}
                      />
                    </div>
                  </div>
                </div>
                {/* <div
                  className={`${styles.printTableContainer}`}
                  ref={tableToPrint}
                >
                  <div className={`${styles.tableHeader}`}>
                    <div className={`${styles.showOnPrint}`}>
                      <FormLabel>
                        {moment().format("DD/MM/YYYY HH:mm")}
                      </FormLabel>
                    </div>
                    <Row>
                      <Col md="12" style={{ textAlign: "center" }}>
                        <Row>
                          <Title level={3} className="mb-0">
                            Multi Box Products: SKU Specific Exceptions
                          </Title>
                        </Row>
                      </Col>
                    </Row>
                    <h4
                    style={{ color: theme?.mono }}
                     className="text-sm text-center font-medium">
                      {exception}
                    </h4>
                  </div>
                  <div className={`${styles.exceptionsTable}`}>
                    <div
                    style={{ borderColor: theme?.monoBorder }}

                      className="border-1 ml-3 border-mono-border w-full rounded"
                      id="multi-box-product-table-container"
                    >
                      <UserTable
                        rowSelection={false}
                        columns={columns}
                        dataSource={[
                          ...selectedSkus,
                          ...selectedSkus,
                          ...selectedSkus,
                        ]}
                        pagination={false}
                        scroll={scroll}
                      />

                      <MultiBoxProductTable
                        id="multi-box-product-table"
                        className={`${styles.multiBoxProductTable}`}
                        rowSelection={false}
                        columns={columns}
                        dataSource={selectedSkus}
                        pagination={false}
                        bordered={true}
                        scroll={scroll}
                        setSelectedRecord={setSelectedRecords}
                      />
                    </div>
                  </div>
                </div> */}
              </Col>
            </Row>
          </div>
        </>
      )}
      {showGrid && (
        <MultiBoxProductsView
          onBack={() => setShowGrid(false)}
          exception={exception}
          componentExceptionSkusList={componentExceptionSkus}
        />
      )}
      <ClearModal
        text={"Warning: All SKU's will be cleared from the List"}
        show={show}
        onHide={() => setShow(false)}
        onConfirm={() => {
          setSelectedSkus([]);
          setChangesMade(true);
          setInfo("All exceptions skus have been removed successfully.");
          setShow(false);
        }}
      />
    </UserDashboard>
  );
};

export default MultiBoxProductsRouting;
