/** @format */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
// import { CSVLink } from "react-csv";
import { Col, Row } from "react-bootstrap";
import { Typography } from "antd";
import _ from "lodash";
import UserDashboard from "../../../components/UserDashboard";
import CarrierPricesTable from "../../../components/Tables/CarrierPricesTable";
import { AmmendCarrierPricesModal } from "../../../components/Modals";
import { AppButton } from "../../../components/AppButton";
import AmendCarrierPrices from "./amend-carrier-prices";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import xlsx from "json-as-xlsx";

import {
  Costing,
  fetchCarrierPriceList,
  setIsDetail,
  setDetailData,
  setSelectedData,
  setDesptachMethodFilter,
  setCarrierFilter,
  setPricingMethod,
  setServiceFilter,

  // EDIT SCREEN STATES
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
  setCarrierPrice,
} from "../../../redux/slices/CarrierPriceSlice";
import stylesMain from "../carrier-routing-control.module.scss";
import {
  carrierPricesCSVHeaders,
  carrierPricesCSVDataConverter,
} from "../../../utils/helpers";

const { Title } = Typography;

interface Props {}

const CarrierPrices = ({}: Props): JSX.Element => {
  const [ammendCarrierPricesModalShow, setAmmendCarrierPricesModalShow] =
    useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("Simple");
  const [page, setPage] = useState(10) as any;

  const carrierPrice = useSelector(
    ({ carrierPrice }: RootStateOrAny) => carrierPrice
  );

  const scroll = {
    x: "max-content",
  };

  const dispatch = useDispatch();

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const {
    carrierPriceList,
    isDetail,
    detailData,
    selectedData,
    loader,
    desptachMethodFilter,
    carrierFilter,
    pricingMethod,
    serviceFilter,
  } = carrierPrice;

  useEffect(() => {
    dispatch(fetchCarrierPriceList());
  }, []);

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const setDesptachMethodFilterFunc = (value: any) => {
    dispatch(setDesptachMethodFilter(value));
  };

  const setCarrierFilterFunc = (value: any) => {
    dispatch(setCarrierFilter(value));
  };

  const setPricingMethodFunc = (value: any) => {
    dispatch(setPricingMethod(value));
  };

  const setServiceFilterFunc = (value: any) => {
    dispatch(setServiceFilter(value));
  };

  const carrierFilterFunc = (carrierPrice: Costing) => {
    if (
      !carrierFilter.filter(
        (item: any) =>
          item.text === (carrierPrice?.carrierName || carrierPrice.carrier)
      ).length
    ) {
      let filter = [
        ...carrierFilter,
        {
          text: carrierPrice?.carrierName || carrierPrice.carrier,
          value: carrierPrice?.carrierName || carrierPrice.carrier,
        },
      ];
      filter = _.sortBy(filter, "text");
      setCarrierFilterFunc(filter);
    }
    if (
      !pricingMethod.filter(
        (item: any) => item.text === carrierPrice?.pricingMethod
      ).length
    ) {
      let filter = [
        ...pricingMethod,
        {
          text: carrierPrice?.pricingMethod,
          value: carrierPrice?.pricingMethod,
        },
      ];
      filter = _.sortBy(filter, "text");
      setPricingMethodFunc(filter);
    }

    if (
      !serviceFilter.filter(
        (item: any) => item.text === carrierPrice?.serviceDescription
      ).length
    ) {
      let filter = [
        ...serviceFilter,
        {
          text: carrierPrice?.serviceDescription,
          value: carrierPrice?.serviceDescription,
        },
      ];
      filter = _.sortBy(filter, "text");
      setServiceFilterFunc(filter);
    }

    if (
      !desptachMethodFilter.filter(
        (item: any) => item.text === carrierPrice?.methodDescription
      ).length
    ) {
      let filter = [
        ...desptachMethodFilter,
        {
          text: carrierPrice?.methodDescription,
          value: carrierPrice?.methodDescription,
        },
      ];
      filter = _.sortBy(filter, "text");

      setDesptachMethodFilterFunc(filter);
    }
  };

  const dataCarrierPrice = useMemo(
    () =>
      carrierPriceList?.costings?.map((carrierPrice: Costing) => {
        const matrixBaseCost =
          carrierPrice?.secondaryCosting?.costingMatrix?.rows?.[0].baseCost;

        const matrixBaseCostPrimary =
          carrierPrice?.primaryCosting?.costingMatrix?.rows?.[0].baseCost;

        return {
          clientMethodID: carrierPrice.clientMethodID,
          name: carrierPrice?.carrierName || carrierPrice.carrier,
          status: carrierPrice.active ? "Active" : "Inactive",
          pricing_method: carrierPrice?.pricingMethod,
          serviceDescription: carrierPrice?.serviceDescription,
          dispatch_method_description: carrierPrice?.methodDescription,
          contracts: carrierPrice.contracts,
          primary_base_cost:
            matrixBaseCostPrimary || carrierPrice?.primaryCosting?.baseCost,
          primary_matrix_record:
            carrierPrice?.primaryCosting?.costingMatrix?.rowCount,
          secondary_base_cost:
            matrixBaseCost || carrierPrice?.secondaryCosting?.baseCost,
          secondary_matrix_record:
            carrierPrice?.secondaryCosting?.costingMatrix?.rowCount,
          permanently_Effective_date:
            carrierPrice?.secondaryCosting?.effectiveFrom,
          effective_between_date_from:
            carrierPrice?.secondaryCosting?.effectiveBetween?.from,
          effective_between_date_to:
            carrierPrice?.secondaryCosting?.effectiveBetween?.to,
        };
      }),
    [carrierPriceList]
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Carrier Prices",
  ]);

  const onChangePagination = (e: any) => {
    setPage(e);
  };

  const filterFunc = async (carrierPriceListCostings: any) => {
    let carrierFilterList = [] as any;
    let pricingMethodList = [] as any;
    let serviceFilterList = [] as any;
    let desptachMethodFilterList = [] as any;
    carrierPriceListCostings.map((carrierPrice: any) => {
      // console.log(
      //   "🚀 ~ file: index.tsx ~ line 182 ~ carrierPriceList?.costings?.forEach ~ carrierPrice",
      //   carrierPrice
      // );
      if (
        !carrierFilterList.filter(
          (item: any) =>
            item.text === (carrierPrice?.carrierName || carrierPrice.carrier)
        ).length
      ) {
        let filter = [
          ...carrierFilterList,
          {
            text: carrierPrice?.carrierName || carrierPrice.carrier,
            value: carrierPrice?.carrierName || carrierPrice.carrier,
          },
        ];
        filter = _.sortBy(filter, "text");
        carrierFilterList = filter;
      }
      if (
        !pricingMethodList.filter(
          (item: any) => item.text === carrierPrice?.pricingMethod
        ).length
      ) {
        let filter = [
          ...pricingMethodList,
          {
            text: carrierPrice?.pricingMethod,
            value: carrierPrice?.pricingMethod,
          },
        ];
        filter = _.sortBy(filter, "text");
        pricingMethodList = filter;
      }

      if (
        !serviceFilterList.filter(
          (item: any) => item.text === carrierPrice?.serviceDescription
        ).length
      ) {
        let filter = [
          ...serviceFilterList,
          {
            text: carrierPrice?.serviceDescription,
            value: carrierPrice?.serviceDescription,
          },
        ];
        filter = _.sortBy(filter, "text");
        serviceFilterList = filter;
      }

      if (
        !desptachMethodFilterList.filter(
          (item: any) => item.text === carrierPrice?.methodDescription
        ).length
      ) {
        let filter = [
          ...desptachMethodFilterList,
          {
            text: carrierPrice?.methodDescription,
            value: carrierPrice?.methodDescription,
          },
        ];
        filter = _.sortBy(filter, "text");
        desptachMethodFilterList = filter;
      }
    });
    setCarrierFilterFunc(carrierFilterList);
    setPricingMethodFunc(pricingMethodList);
    setServiceFilterFunc(serviceFilterList);
    setDesptachMethodFilterFunc(desptachMethodFilterList);
  };

  useEffect(() => {
    if (carrierPriceList?.costings) {
      filterFunc(carrierPriceList?.costings);
    }
  }, [carrierPriceList]);

  const handleRowClick = (record: any, event: any) => {
    setDetailDataFunc(record);
  };

  const handleCancel = () => {
    setDetailDataFunc(null);
    setSelectedDataFunc(null);
    setIsDetailFunc(false);
  };

  const setIsDetailFunc = (value: boolean) => {
    dispatch(fetchCarrierPriceList());
    dispatch(setPermanentlyDateData(null));
    dispatch(setSecondaryData([]));
    dispatch(setAmmendData([]));
    dispatch(setEditKey(""));
    dispatch(setEditSecondaryKey(""));
    dispatch(setDisableSaveBtn(true));
    dispatch(setOnEditing(false));
    dispatch(setTick(false));
    dispatch(setSecondaryParamsBestPrice(""));
    dispatch(setEffectiveBetweenDate(null));
    setDetailDataFunc(null);
    dispatch(setIsDetail(value));
  };

  const setDetailDataFunc = (value: any) => {
    dispatch(setDetailData(value));
  };

  const setEditFunc = () => {
    dispatch(setCarrierPrice(null));
    dispatch(setPermanentlyDateData(null));
    dispatch(setSecondaryData([]));
    dispatch(setAmmendData([]));
    dispatch(setEditKey(""));
    dispatch(setEditSecondaryKey(""));
    dispatch(setDisableSaveBtn(true));
    dispatch(setOnEditing(false));
    dispatch(setTick(false));
    dispatch(setSecondaryParamsBestPrice(""));
    dispatch(setEffectiveBetweenDate(null));
    setTimeout(() => {
      dispatch(fetchCarrierPriceList());
      dispatch(setIsDetail(true));
    }, 100);
  };

  const setSelectedDataFunc = (value: number | null) =>
    dispatch(setSelectedData(value));

  const exportCsv = () => {
    let data = [
      {
        sheet: "Carrier Prices",
        columns: carrierPricesCSVHeaders(),
        content: carrierPricesCSVDataConverter(carrierPriceList),
      },
    ];

    let settings = {
      fileName: "Carrier Prices", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
    };

    xlsx(data, settings);
  };

  return (
    <UserDashboard>
      {!isDetail ? (
        <>
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Deselect Edit"
            style={{
              borderRadius: "4px",
              right: "420px",
            }}
            disabled={CUDDisabled || !detailData}
            onClick={handleCancel}
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Edit"
            style={{ borderRadius: "4px", right: "285px" }}
            onClick={() => setEditFunc()}
            disabled={CUDDisabled || !detailData}
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Print"
            style={{ borderRadius: "4px", right: "150px" }}
            onClick={handlePrint}
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${stylesMain.buttonInHeader}`}
            title="Export"
            style={{ borderRadius: "4px" }}
            onClick={() => exportCsv()}
          />

          <div
            ref={componentToPrintRef}
            className={`z-0 scroll-page ${stylesMain.mainPrintTableContainer}`}
          >
            <Row>
              <Col md="4"></Col>
              <Col md="4" style={{ textAlign: "center", marginBottom: -5 }}>
                <Row>
                  <Title level={3}>Carrier Prices</Title>
                </Row>
              </Col>
            </Row>
            <div className="flex flex-col">
              <div className="flex justify-center w-full">
                <div
                  className="z-0 mt-2 scroll-page w-full text-nowrap"
                  id="carrier-prices-table"
                >
                  <CarrierPricesTable
                    rowSelection={false}
                    handleRowClick={handleRowClick}
                    pagination={false}
                    defaultRowCount={page}
                    dataSource={dataCarrierPrice}
                    carrierFilter={carrierFilter}
                    pricingMethod={pricingMethod}
                    serviceFilter={serviceFilter}
                    desptachMethodFilter={desptachMethodFilter}
                    scroll={scroll}
                    setValue={setSelectedDataFunc}
                    value={selectedData}
                    loading={loader}
                    CUDDisabled={CUDDisabled}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="mt-2"
          >
            {/* <PaginationDropdown
              count={paginationCount}
              onPagination={(e) => onChangePagination(e)}
              value={page}
            /> */}
          </div>
          <AmmendCarrierPricesModal
            modalType={modalType}
            show={ammendCarrierPricesModalShow}
            onHide={() => setAmmendCarrierPricesModalShow(false)}
          />
        </>
      ) : (
        <AmendCarrierPrices
          detailData={detailData}
          setDetailData={setDetailDataFunc}
          setIsDetail={setIsDetailFunc}
          setValue={setSelectedDataFunc}
          isDetail={isDetail}
        />
      )}
    </UserDashboard>
  );
};

export default CarrierPrices;
