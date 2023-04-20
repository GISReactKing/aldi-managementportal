import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import ByRegionTable from "../../../components/Tables/ByRegionTable";
import { AppButton } from "../../../components/AppButton";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  setPageProps,
  fetchSkusWithRegions,
} from "../../../redux/slices/productFixingRoutingByRegionSlice";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { FormLabel } from "react-bootstrap";
import { Col, Row, Typography } from "antd";
import _ from "lodash";

const { Title } = Typography;

type Props = {
  data: any;
  onBack: () => void;
};

const columns: any = [
  {
    title: <span className={styles.columnHeader}>SKU</span>,
    dataIndex: "Sku",
    key: "Sku",
    showSorterTooltip: false,
    render: (item: string, record: any) => {
      return (
        <div>
          <span>{item}</span>
        </div>
      );
    },
  },
  {
    title: <span className={styles.columnHeader}>Post Code Region</span>,
    dataIndex: "RegionListName",
    key: "RegionListName",
    className: "table-header-col",
    showSorterTooltip: false,
    render: (item: number[]) => {
      return <span className="text-left">{item}</span>;
    },
    width: 180,
  },
  {
    title: <span className={styles.columnHeader}>Carrier</span>,
    showSorterTooltip: false,
    dataIndex: "Carrier",
    key: "Carrier",
    render: (item: string) => {
      return <span className="text-left">{item}</span>;
    },
    width: 120,
  },
  // {
  //   title: <span className={styles.columnHeader}>Service</span>,
  //   showSorterTooltip: false,
  //   dataIndex: "ServiceName",
  //   key: "ServiceName",
  //   render: (item: string) => {
  //     return <span className="text-left">{item}</span>;
  //   },
  //   width: 120,
  //   className: `${styles.hideColumnOnPrint}`,
  // },
  // {
  //   title: <span className={styles.columnHeader}>Method</span>,
  //   showSorterTooltip: false,
  //   dataIndex: "MethodName",
  //   key: "MethodName",
  //   render: (item: string) => {
  //     return <span className="text-left">{item}</span>;
  //   },
  //   className: `${styles.hideColumnOnPrint}`,
  // },
  {
    title: <span className={styles.columnHeader}>Despatch</span>,
    showSorterTooltip: false,
    dataIndex: "Despatch",
    key: "Despatch",
    render: (item: string) => {
      return <span className="text-left">{item || "Despatch"}</span>;
    },
    width: 120,
  },
  {
    title: <span className={styles.columnHeader}>From Date</span>,
    showSorterTooltip: false,
    dataIndex: "EffectiveDateStart",
    key: "EffectiveDateStart",

    render: (item: string) => {
      return (
        <span className="text-left">{moment(item).format("DD/MM/YYYY")} </span>
      );
    },
    width: 120,
  },
  {
    title: <span className={styles.columnHeader}>To Date</span>,
    showSorterTooltip: false,
    dataIndex: "EffectiveDateEnd",
    key: "EffectiveDateEnd",

    render: (item: string) => {
      return (
        <span className="text-left">{moment(item).format("DD/MM/YYYY")} </span>
      );
    },
    width: 120,
  },
];

const ByRegionFullTable = ({ onBack }: Props) => {
  const csvLink = useRef() as any;

  const componentToPrintRef = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const dispatch = useDispatch();
  const [csvData, setCsvData] = useState<any>([]);
  const scroll = {
    x: "max-content",
  };
  const [loading, setLoading] = useState(false);

  const skusRegionList = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.skusRegionList
  );

  const loader = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.fullListloader
  );

  const byRegionDespatchState = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.byRegionDespatchState
  );

  useEffect(() => {
    if (!byRegionDespatchState.fullListLoaded) {
      dispatch(fetchSkusWithRegions());
      dispatch(
        setPageProps({
          fullListLoaded: true,
        })
      );
    }
  }, []);

  const fetchCsvData = async () => {
    setLoading(true);
    if (skusRegionList?.length) {
      let resultData: any = [];
      await skusRegionList.map((item: any) => {
        resultData.push({
          Sku: item.Sku,
          EffectiveDateStart: item.EffectiveDateStart
            ? moment(item.EffectiveDateStart).format("DD/MM/YYYY")
            : "",
          EffectiveDateEnd: item.EffectiveDateEnd
            ? moment(item.EffectiveDateEnd).format("DD/MM/YYYY")
            : "",
          RegionListName: item.RegionListName,
          Despatch: item.Despatch,
          Carrier: item.Carrier,
          // Service: item.ServiceName,
          // Method: item.MethodName,
        });
      });
      resultData = await resultData.sort((a: any, b: any) => {
        let aCopy = a.Sku.slice(0, a.Sku.indexOf(": "));
        let bCopy = b.Sku.slice(0, b.Sku.indexOf(": "));
        return aCopy.localeCompare(bCopy);
      });
      setCsvData(resultData);
    }
  };

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "SKU", [key]: "Sku" },
      { [label]: "Post Code Region", [key]: "RegionListName" },
      { [label]: "Carrier", [key]: "Carrier" },
      // { [label]: "Service", [key]: "Service" },
      // { [label]: "Method", [key]: "Method" },
      { [label]: "Despatch", [key]: "Despatch" },
      { [label]: "From Date", [key]: "EffectiveDateStart" },
      { [label]: "To Date", [key]: "EffectiveDateEnd" },
    ];
    return headers;
  };

  useEffect(() => {
    if (csvData.length) {
      csvLink?.current?.link?.click();
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [csvData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.buttonsGroup}>
            <AppButton
              className="xsm:h-9 lg:h-10 font-bold tracking-wide mt-5"
              style={{
                borderRadius: "4px",
                position: "absolute",
                right: "240px",
                top: "0px",
              }}
              onClick={onBack}
              title="Back"
            />

            <AppButton
              className="xsm:h-9 lg:h-10 font-bold tracking-wide mt-5"
              style={{
                borderRadius: "4px",
                position: "absolute",
                right: "145px",
                top: "0px",
              }}
              onClick={handlePrint}
              title="Print"
            />

            <AppButton
              className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0"
              style={{
                borderRadius: "4px",
                position: "absolute",
                right: "10px",
                top: "0px",
              }}
              onClick={fetchCsvData}
              title="Export"
              disabled={loading}
            />

            <CSVLink
              data={csvData}
              headers={makeHeaders("label", "key")}
              filename={"product-fixed-routing-by-region.csv"}
              ref={csvLink}
            />
          </div>
        </div>
        <div className="z-0 scroll-page" id="region-table">
          <div
            className={`${styles.printTableContainer}`}
            ref={componentToPrintRef}
          >
            <div className={`${styles.tableHeader}`}>
              <div className={`${styles.showOnPrint}`}>
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Row>
                <Col md="12" style={{ textAlign: "center" }}>
                  <Row>
                    <Title level={3} className="mb-0">
                      Product Fixed Routing: By Region
                    </Title>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className={`${styles.printWidth}`}>
              <ByRegionTable
                columns={columns}
                dataSource={skusRegionList}
                pagination={false}
                loading={loader}
                scroll={scroll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByRegionFullTable;
