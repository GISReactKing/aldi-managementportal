import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Typography, Table, List, Spin } from "antd";
import { Col, Form, Row } from "react-bootstrap";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import moment from "moment";
import _ from "lodash";
import UserDashboard from "../../../components/UserDashboard";
import styles from "./styles.module.scss";
import ProductFixedRoute from "./product-fixed-routing";
import { AppButton } from "../../../components/AppButton";
import {
  setPageProps,
  setInitialDetailPageProps,
  fetchCategories,
  fetchSkus,
  fetchAllSkus,
  fetchCategoryDetail,
  addCategoryDetail,
  updateCategoryDetail,
  fetchExportCategoryDetail,
  clearCategoryDetail,
  deleteCategoryDetail,
  setCategoryDetailData,
} from "../../../redux/slices/productFixedRoutingDespatch";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import { Message } from "../../../utils/message";
import ClearModal from "../../../components/Modals/ProductFixedRoutingDespatch/ClearModal";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import useAppSelector from "../../../hooks/useAppSelector";
import useTheme from "../../../hooks/useTheme";
import axios, { CancelTokenSource } from "axios";

const { Title } = Typography;

const BLANK_CATEGORY = "BLANK";
type ProductFixedRouting = {
  ClientCode: string;
  ClientDespatchMethodID: string;
  ClientDespatchServiceID: number;
  ProductFixedRoutingID: number;
  Sku: string;
};

let interval: any = null;

const DispatchReturns = () => {
  const theme = useTheme();
  const csvLink = useRef() as any;
  const previousSource = useRef<CancelTokenSource | null>(null);
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [isProductFixedRoute, setProductFixedRoute] = useState<boolean>(false);
  const [selectedSku, setSelectedSku] = useState("");
  const [selectedSkuDescription, setSelectedSkuDescription] = useState("");
  const [skuList, setSkuList] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [disableSelectSku, setDisableSelectSku] = useState<boolean>(false);
  const [popUpShow, setPopUpShow] = useState<boolean>(false);
  // const [selectedFromList, setSelectedFromList] = useState(null);
  const [selectedFromList, setSelectedFromList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportLoader, setExportLoader] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    category: null,
    show_products_fixed: false,
    include_skus_fixed: false,
  });
  const [productFixedRouting, setProductFixedRouting] = useState<any>({});
  const [skuFilterList, setSkuFilterList] = useState<any>([]);
  const [customPreferenceIDs, setCustomPreferenceIDs] = useState<number[]>([]);

  const blankCategory = formData.category === BLANK_CATEGORY;
  const scroll = {
    x: "max-content",
  };

  const loader = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.loader
  );

  const skusData = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.skus
  );

  const categories = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.categories
  );

  const categoryLoader = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.categoryLoader
  );

  const despatchState = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.despatchState
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Product Fixed Routing: by SKU",
  ]);
  const skusColumns = [
    {
      title: "SKU Code",
      dataIndex: "Item_Code",
      key: "Item_Code",
      className: "sku-header",
      width: 180,
    },
    {
      title: "Item Description",
      dataIndex: "Item_Description",
      key: "Item_Description",
      className: "sku-header",
    },
  ];

  useEffect(() => {
    dispatch(fetchCategories());
    setFormData(despatchState.formData);
    setPopUpShow(despatchState.popUpShow);
    setSelectedSku(despatchState.selectedSku);
    setSelectedSkus(despatchState.selectedSkus);
    setSkuFilterList(despatchState.skuFilterList);
    setSkuList(despatchState.skuList);
    setSelectedSkuDescription(despatchState.selectedSkuDescription);
    setProductFixedRoute(despatchState.isProductFixedRoute);
    setProductFixedRouting(despatchState.productFixedRouting);
    setCustomPreferenceIDs(despatchState.customPreferenceIDs);
  }, []);

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "SKU & Description", [key]: "sku_description" },
      { [label]: "Multi Box", [key]: "multi_box" },
      { [label]: "Carrier", [key]: "carrier_dispatch" },
      { [label]: "Despatch Date From", [key]: "from_dispatch" },
      { [label]: "Despatch Date To", [key]: "to_dispatch" },
      { [label]: "Stock Quantity", [key]: "stock_qty" },
      { [label]: "KG", [key]: "kg" },
      { [label]: "Max Dim", [key]: "max_dim" },
      { [label]: "Length", [key]: "length" },
      { [label]: "Depth", [key]: "depth" },
      { [label]: "Height", [key]: "height" },
      // { [label]: "Service", [key]: "service" },
      // { [label]: "Method", [key]: "method" },
    ];
    return headers;
  };

  const fetchCsvData = async () => {
    try {
      setExportLoader(true);
      const { payload } = await dispatch(
        fetchExportCategoryDetail({
          code: formData.category,
          ClientCode: "ALDI",
          ForRegions: false,
          ExistingFixedRouting: false,
          SkuList: [],
        }) as any
      );
      if (payload?.data?.length) {
        const payloadData = _.sortBy(payload.data, "Item_Code");
        const resultData = payloadData.map((item: any) => {
          return {
            sku_description: `${
              item.Item_Code
            }: ${item.Item_Description.replace(`\"`, "")}`,
            multi_box: item["Multi-Box_Item"],
            carrier_dispatch: item.CarrierCode,
            from_dispatch: item.EffectiveDateStart
              ? moment(item.EffectiveDateStart).format("DD/MM/YYYY")
              : "",
            to_dispatch: item.EffectiveDateEnd
              ? moment(item.EffectiveDateEnd).format("DD/MM/YYYY")
              : "",
            includes_dispatch: item.Stock_on_Hand >= 0 ? "Y" : "N",
            stock_qty:
              item.Stock_on_Hand >= 0 ? ComaSeparator(item.Stock_on_Hand) : "",
            kg:
              item.Item_Weight >= 0
                ? ComaSeparator(item.Item_Weight.toFixed(2))
                : "",
            max_dim: item.Max_Dim >= 0 ? ComaSeparator(item.Max_Dim) : "",
            length: item.Item_Width >= 0 ? ComaSeparator(item.Item_Width) : "",
            depth: item.Item_Depth >= 0 ? ComaSeparator(item.Item_Depth) : "",
            // service: item.ClientDespatchServiceName || "",
            // method: item.ClientDespatchMethodCode || "",
            height:
              item.Item_Height >= 0 ? ComaSeparator(item.Item_Height) : "",
          };
        });

        setCsvData(resultData);

        setTimeout(() => {
          csvLink?.current?.link?.click();
          setExportLoader(false);
        }, 1000);
      }
    } catch (error) {
      setExportLoader(false);
    }
  };

  const onSkuRemove = () => {
    // if (selectedFromList == null) {
    if (!selectedFromList.length) {
      return;
    }
    const selectedSkusCopy = [...selectedSkus];
    const skuListCopy = [...skuList];
    selectedFromList.forEach((item) => {
      let index = selectedSkusCopy.indexOf(item);
      if (index !== -1) {
        selectedSkusCopy.splice(index, 1);
        skuListCopy.splice(index, 1);
      }
    });
    // selectedSkusCopy.splice(selectedFromList, 1);
    // skuListCopy.splice(selectedFromList, 1);
    setSkuList(skuListCopy);
    setSelectedFromList([]);
    setSelectedSkus([...selectedSkusCopy]);
    dispatch(
      setPageProps({
        selectedSkus: selectedSkusCopy,
        skuList: skuListCopy,
        selectedFromList: [],
      })
    );
  };

  const onClearList = () => {
    setShow(false);
    setSelectedSkus([]);
    setSkuList([]);
    setSelectedFromList([]);
    dispatch(
      setPageProps({
        selectedSkus: [],
        skuList: [],
        selectedFromList: [],
      })
    );
  };
  const handleChange = (e: any) => {
    let formDataCopy = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setPopUpShow(false);
    if (e.target.name === "category") {
      setSelectedSku("");
      setSelectedSkus([]);
      setSkuList([]);
      setSelectedSkuDescription("");
      formDataCopy = {
        ...formDataCopy,
        show_products_fixed: false,
        include_skus_fixed: false,
      };
      dispatch(
        setPageProps({
          selectedSku: "",
          selectedSkus: [],
          skuList: [],
          selectedSkuDescription: "",
          popUpShow: false,
        })
      );
    }

    dispatch(setPageProps({ formData }));

    setFormData(formDataCopy);
    if (e.target.value && e.target.value !== BLANK_CATEGORY) {
      if (typeof previousSource.current?.cancel === "function")
        previousSource.current.cancel();
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      previousSource.current = source;
      dispatch(
        fetchSkus({
          code: e.target.value,
          ForRegions: false,
          source,
        })
      );
    }
  };

  const handleDisplayCategoryDetails = () => {
    setProductFixedRoute(true);
    setProductFixedRouting(despatchState.productFixedRouting);
    setCustomPreferenceIDs(despatchState.customPreferenceIDs);
    dispatch(setPageProps({ isProductFixedRoute: true }));
  };

  const handleChangeCheckbox = (e: any) => {
    if (e.target.name === "show_products_fixed") {
      let formDataCopy = {
        ...formData,
        [e.target.name]: e.target.checked,
      };
      setFormData(formDataCopy);
      setSelectedSkus([]);
      setSelectedSku("");
      setSelectedSkuDescription("");
      dispatch(
        setPageProps({
          formData: formDataCopy,
          selectedSkus: [],
          selectedSku: "",
          selectedSkuDescription: "",
        })
      );
    }
    if (e.target.name === "include_skus_fixed") {
      setSelectedSku("");
      setSelectedSkus([]);
      setSkuList([]);
      setSelectedSkuDescription("");
      setPopUpShow(false);
      let formDataCopy = {
        ...formData,
        [e.target.name]: e.target.checked,
      };
      setFormData(formDataCopy);
      dispatch(
        setPageProps({
          selectedSku: "",
          selectedSkus: [],
          skuList: [],
          selectedSkuDescription: "",
          popUpShow: false,
          formData: formDataCopy,
        })
      );
      if (typeof previousSource.current?.cancel === "function")
        previousSource.current.cancel();
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      previousSource.current = source;
      dispatch(
        fetchSkus({
          code: formData.category,
          ForRegions: !!e.target.checked,
          source,
        })
      );
    }
  };

  const onChangeSku = ({ target }: any) => {
    if (target.value == "") {
      setPopUpShow(false);
      setSelectedSku(target.value);
      clearInterval(interval);
      setSkuFilterList(skusData);
      dispatch(
        setPageProps({
          popUpShow: false,
          selectedSku: target.value,
          skuFilterList: skusData,
        })
      );
      return;
    }

    let filterSkusList = skusData?.filter(
      (sku: any) =>
        sku.Item_Code.toUpperCase().includes(target.value.toUpperCase()) ||
        sku.Item_Description.toUpperCase().includes(target.value.toUpperCase())
    );
    setSkuFilterList(filterSkusList);
    setSelectedSku(target.value);
    setPopUpShow(true);
    dispatch(
      setPageProps({
        skuFilterList: filterSkusList,
        popUpShow: true,
        selectedSku: target.value,
      })
    );
  };

  const onAddSku = () => {
    if (!selectedSku) {
      return false;
    }
    let copyFormData = {
      ...formData,
      show_products_fixed: false,
    };
    let selectedSkusCopy = [...selectedSkus];
    const skuListCopy = [...skuList];
    selectedSkusCopy.push(`${selectedSku}: ${selectedSkuDescription}`);
    selectedSkusCopy = selectedSkusCopy.sort((a, b) => {
      let aCopy = a.slice(a.indexOf(": ") + 2);
      let bCopy = b.slice(b.indexOf(": ") + 2);
      return aCopy.localeCompare(bCopy);
    });
    // @ts-ignore
    let copySkuList = [...skuListCopy, selectedSku];
    setSelectedSkus(selectedSkusCopy);
    setSkuList(copySkuList);
    setSelectedSku("");
    setSelectedSkuDescription("");
    clearInterval(interval);
    setFormData(copyFormData);
    dispatch(
      setPageProps({
        formData: copyFormData,
        selectedSkus: selectedSkusCopy,
        skuList: copySkuList,
        selectedSku: "",
        selectedSkuDescription: "",
      })
    );
  };

  const onBack = () => {
    dispatch(setInitialDetailPageProps());
    dispatch(clearCategoryDetail());
    setProductFixedRoute(false);
    dispatch(setPageProps({ isProductFixedRoute: false }));
  };

  const resetAllData = () => {
    setSelectedSkus([]);
    setSkuList([]);
    setFormData({
      category: null,
      show_products_fixed: false,
      include_skus_fixed: false,
    });
    dispatch(
      setPageProps({
        selectedSkus: [],
        skuList: [],
        formData: {
          category: null,
          show_products_fixed: false,
          include_skus_fixed: false,
        },
      })
    );
  };

  const onConfirm = (data: any) => {
    setProductFixedRouting(data);
    dispatch(setPageProps({ productFixedRouting: data }));
  };

  const onClear = (data: any) => {
    const { ProductFixedRouting } = data;
    const customPreferenceIDList = [] as number[];
    ProductFixedRouting.forEach((item: ProductFixedRouting) => {
      if (item.ProductFixedRoutingID) {
        customPreferenceIDList.push(item.ProductFixedRoutingID);
      }
    });
    if (customPreferenceIDList.length) {
      setCustomPreferenceIDs(customPreferenceIDList);
      dispatch(setPageProps({ customPreferenceIDs: customPreferenceIDList }));
    }
  };

  const onSave = async () => {
    try {
      setIsLoading(true);
      if (customPreferenceIDs.length > 0) {
        dispatch(deleteCategoryDetail(customPreferenceIDs));
      } else {
        setIsLoading(true);
        const updateProductFixedRouting = [] as any;
        const addProductFixedRouting = [] as any;
        await productFixedRouting.ProductFixedRouting.map((item: any) => {
          if (item.ProductFixedRoutingID) {
            updateProductFixedRouting.push(item);
          } else {
            addProductFixedRouting.push(item);
          }
        });

        if (updateProductFixedRouting.length) {
          await dispatch(
            updateCategoryDetail({
              ProductFixedRouting: updateProductFixedRouting,
              ForRegions: false,
            }) as any
          );
        }
        if (addProductFixedRouting.length) {
          await dispatch(
            addCategoryDetail({
              ProductFixedRouting: addProductFixedRouting,
              ForRegions: false,
            }) as any
          );
        }
      }
    } catch (error) {
      console.log({ error });
    } finally {
      let result = await dispatch(
        fetchCategoryDetail({
          code: formData.category,
          ClientCode: "ALDI",
          ForRegions: formData.include_skus_fixed,
          ExistingFixedRouting: formData.show_products_fixed,
          SkuList: skuList,
        }) as any
      );

      if (Array.isArray(result?.payload?.data))
        dispatch(setCategoryDetailData(result?.payload?.data));
      setIsLoading(false);
      dispatch(setInitialDetailPageProps());
      setProductFixedRouting({});
      setCustomPreferenceIDs([]);
    }
  };

  const selectedListItem = (value: string) => {
    const index = selectedFromList.indexOf(value);
    if (index !== -1) {
      const newSelectedFromList = [...selectedFromList];
      newSelectedFromList.splice(newSelectedFromList.indexOf(value), 1);
      setSelectedFromList(newSelectedFromList);
      dispatch(
        setPageProps({
          selectedFromList: newSelectedFromList,
        })
      );
    } else {
      setSelectedFromList([...selectedFromList, value]);
      dispatch(
        setPageProps({
          selectedFromList: [...selectedFromList, value],
        })
      );
    }
  };

  console.log(
    (!productFixedRouting.ProductFixedRouting && !customPreferenceIDs.length) ||
      isLoading ||
      CUDDisabled
      ? "darkgray"
      : theme?.white,
    !productFixedRouting.ProductFixedRouting && !customPreferenceIDs.length
  );
  return (
    <UserDashboard>
      <>
        <Row className="mb-3">
          {/* {categoryLoader ? (
              <Spin
                //@ts-ignore
                tip={
                  <span className="inline-block ml-2">
                    Please wait category is loading ...
                  </span>
                }
                style={{
                  display: "block",
                  flexDirection: "row",
                  position: "absolute",
                  top: "210px",
                  left: "-50px",
                }}
              />
            ) : null} */}
          <Col md="3"></Col>
          <Col md="5">
            <Title level={3} className="text-center">
              Product Fixed Routing
            </Title>
          </Col>
          <Col md="3" style={{ textAlign: "end" }}>
            {isProductFixedRoute && (
              <>
                <AppButton
                  className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
                  onClick={onBack}
                  style={{ right: "450px" }}
                  title="Back"
                />
                <AppButton
                  className={`lg:h-8 font-bold rounded text-center ${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
                  onClick={onSave}
                  style={{
                    borderRadius: "4px",
                    right: "300px",
                  }}
                  disabled={
                    (!productFixedRouting.ProductFixedRouting &&
                      !customPreferenceIDs.length) ||
                    isLoading ||
                    CUDDisabled
                  }
                  loading={isLoading}
                  title="Save"
                />

                <AppButton
                  className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
                  onClick={fetchCsvData}
                  title="Export"
                  loading={exportLoader}
                  disabled={exportLoader}
                />
                <CSVLink
                  data={csvData}
                  headers={makeHeaders("label", "key")}
                  filename={"product-fixed-routing.csv"}
                  ref={csvLink}
                />
              </>
            )}
            {!isProductFixedRoute && (
              <>
                {/* <AppButton
                    className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-40 z-50`}
                    onClick={resetAllData}
                    title="Clear"
                  /> */}

                <AppButton
                  className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
                  onClick={handleDisplayCategoryDetails}
                  disabled={!formData.category || blankCategory}
                  title="Display"
                />
              </>
            )}
          </Col>
        </Row>
        {!isProductFixedRoute && (
          <Row className="justify-content-center">
            <Col md="12" className="d-flex" style={{ width: "1050px" }}>
              <Form onSubmit={onSave} style={{ width: "80%" }}>
                <Row className={`${styles.createUserFormRow}`}>
                  <Col lg="12" md="12">
                    <Row className={`${styles.createUserFormRow}`}>
                      <Form.Group
                        as={Row}
                        className="mr-5 "
                        controlId="role"
                        style={{ alignSelf: "start" }}
                      >
                        <Form.Label
                          style={{ width: "150px", marginTop: "7px" }}
                        >
                          Select Category:
                        </Form.Label>
                        <Form.Select
                          data-testId="PFRD_SelectCarrier"
                          style={{ width: "200px", height: "40px" }}
                          defaultValue={formData.category || ""}
                          value={formData.category || ""}
                          name="category"
                          required
                          onChange={handleChange}
                        >
                          <option value="">Select Category</option>
                          {/* <option value={BLANK_CATEGORY}>
                            {BLANK_CATEGORY}
                            // this has been commented to be revisited later
                            // please do not remove
                          </option> */}
                          {categories.map((item: any, index: any) => (
                            <option value={item.Stock_Item_Code} key={index}>
                              {item.Stock_Item_Code}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md="12">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{ width: 400 }}
                        data-testId="PFRD_onlyshow_label"
                      >
                        Only show Products with Existing Fixed Carrier Routing:
                      </div>
                      <Checkbox
                        data-testId="PFRD_productfixedcheckbox"
                        name="show_products_fixed"
                        checked={formData.show_products_fixed}
                        onChange={handleChangeCheckbox}
                        disabled={
                          !!selectedSkuDescription ||
                          !!selectedSkus.length ||
                          !formData.category ||
                          blankCategory
                        }
                        className="product-fixed-routing-checkbox"
                      />
                    </div>
                  </Col>
                  <Col md="12" className="mt-3">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{ width: 400 }}
                        data-testId="PFRD_LABEL_INCLUDE_SKU"
                      >
                        Include SKU&apos;s with Fixed Routing by Region:
                      </div>
                      <Checkbox
                        name="include_skus_fixed"
                        checked={formData.include_skus_fixed}
                        onChange={handleChangeCheckbox}
                        disabled={!formData.category || blankCategory}
                        // className="product-fixed-routing-checkbox"
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={12} className="position-relative">
                    <div
                      className="sku-popup position-absolute"
                      style={{
                        zIndex: 999,
                        bottom: "88%",
                        maxWidth: 500,
                      }}
                      hidden={!popUpShow}
                    >
                      <Table
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (e) => {
                              if (
                                selectedSkus.indexOf(
                                  `${record.Item_Code}: ${record.Item_Description}`
                                ) === -1
                              ) {
                                setSelectedSku(record.Item_Code);
                                setSelectedSkuDescription(
                                  record.Item_Description
                                );
                                setPopUpShow(false);
                                dispatch(
                                  setPageProps({
                                    selectedSku: record.Item_Code,
                                    selectedSkuDescription:
                                      record.Item_Description,
                                    popUpShow: false,
                                  })
                                );
                              } else {
                                Message(
                                  "danger",
                                  `The SKU ${record.Item_Code}: ${record.Item_Description} has already been selected.`
                                );
                              }
                            },
                          };
                        }}
                        rowKey={"_id"}
                        size={"small"}
                        loading={false}
                        bordered={true}
                        pagination={false}
                        columns={skusColumns}
                        dataSource={skuFilterList}
                        scroll={{ y: "200px" }}
                      />
                    </div>
                    <Form.Group>
                      <Form.Label data-testId="PFRD_Amendment">
                        Select SKU&apos;s for Amendment:
                      </Form.Label>
                      <br />
                      <Row className="d-flex align-items-center">
                        <Col md={7}>
                          <Form.Control
                            className={styles.formItem}
                            name="sku"
                            placeholder="Enter Search Characters"
                            value={selectedSku}
                            disabled={
                              // disableSelectSku || loader || !formData.category
                              loader ||
                              !formData.category ||
                              formData.show_products_fixed ||
                              blankCategory
                            }
                            onChange={onChangeSku}
                          />
                        </Col>
                        <Col md={5}>
                          <Form.Label style={{ marginTop: "7px" }}>
                            {loader ? (
                              <>
                                <Spin
                                  //@ts-ignore
                                  tip={
                                    <span className="inline-block ml-2 position-absolute">
                                      Loading skus ...
                                    </span>
                                  }
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "170px",
                                  }}
                                />
                              </>
                            ) : (
                              selectedSkuDescription
                            )}
                          </Form.Label>
                        </Col>
                      </Row>

                      <Col className="mt-2">
                        <Button
                          className={`${styles.buttonInContent} xsm:h-9 lg:h-10 font-bold tracking-wide mr-3`}
                          onClick={onAddSku}
                          disabled={!selectedSkuDescription || loader}
                        >
                          Add
                        </Button>
                        <Button
                          className={`${styles.buttonInContent} xsm:h-9 lg:h-10 font-bold tracking-wide mr-3`}
                          onClick={onSkuRemove}
                          disabled={
                            disableSelectSku ||
                            !selectedSkus.length ||
                            !selectedFromList.length ||
                            loader
                          }
                        >
                          Remove
                        </Button>
                        <Button
                          className={`${styles.buttonInContent} xsm:h-9 lg:h-10 font-bold tracking-wide mr-3`}
                          onClick={() => setShow(true)}
                          disabled={
                            disableSelectSku || !selectedSkus.length || loader
                          }
                        >
                          Clear
                        </Button>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <List
                header={
                  <h4 style={{ fontWeight: "bold" }}>
                    {`SKU's Selected for Amendment`}
                  </h4>
                }
                size="small"
                style={{
                  width: "90%",
                  height: "480px",
                  overflow: "auto",
                  marginLeft: "60px",
                }}
                locale={{ emptyText: " " }}
                bordered
                dataSource={selectedSkus}
                renderItem={(item: any, index: any) => (
                  <List.Item
                    key={index}
                    // style={{ cursor: "pointer" }}
                    // className={
                    //   selectedFromList === index
                    //     ? styles.selectedListItem
                    //     : ""
                    // }
                    // onClick={() => setSelectedFromList(index)}
                  >
                    <span>{item}</span>
                    <Checkbox
                      checked={selectedFromList.indexOf(item) !== -1}
                      onChange={(e) => selectedListItem(item)}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        )}
      </>
      {isProductFixedRoute && (
        <ProductFixedRoute
          showModal={showModal}
          onHide={() => setShowModal(false)}
          formData={formData}
          onConfirm={onConfirm}
          onClear={onClear}
          skuList={skuList}
          scroll={scroll}
          CUDDisabled={CUDDisabled}
        />
      )}
      <ClearModal
        text={"Warning: All SKU's will be cleared from the List"}
        show={show}
        onHide={() => setShow(false)}
        onConfirm={onClearList}
      />
    </UserDashboard>
  );
};

export default DispatchReturns;
