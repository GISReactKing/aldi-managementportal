import React, { forwardRef, useEffect, useRef, useState } from "react";
import uniq from "lodash/uniq";
import { CSVLink } from "react-csv";
import { Col, FormLabel, Row } from "react-bootstrap";
import { Spin, Typography } from "antd";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import styles from "./multi-box-products.module.scss";
import MultiBoxProductTable from "../../../components/Table";
import { AppButton } from "../../../components/AppButton";

import {
  IExceptionSkuListRow,
  ISkuListRow,
} from "../../../redux/types/multi-box";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { fetchMultiBoxExceptionSkus } from "../../../redux/slices/multiBoxProductsRoutingSlice";
import moment from "moment";
import useTheme from "../../../hooks/useTheme";

const { Title } = Typography;
interface Props {
  exception: String;
  onBack?: () => void;
  componentExceptionSkusList: IExceptionSkuListRow[];
}

interface ITableDataSource {
  product: string;
  componentNumber: string;
  component: string;
}

interface IPrintProps {
  columns: any;
  dataSource: ITableDataSource[];
}

const MultiBoxProductsView = ({
  exception,
  onBack,
  componentExceptionSkusList,
}: Props) => {
  const csvLink = useRef() as any;
  const theme = useTheme();

  const tableToPrint = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => tableToPrint.current,
  });
  const dispatch = useDispatch();
  const [csvData, setCsvData] = useState<ITableDataSource[]>([]);
  const [loading, setLoading] = useState(false);

  const multiBoxLoading = useSelector(
    ({ multiBoxProductsRouting }: RootStateOrAny) =>
      multiBoxProductsRouting.loading
  );

  async function loadExceptionSkus() {
    try {
      await dispatch(
        fetchMultiBoxExceptionSkus({
          client: "aldi",
        }) as any
      );
    } catch (error) {
    } finally {
    }
  }

  useEffect(() => {
    // load exception skus components
    loadExceptionSkus();
    return () => {};
  }, []);

  useEffect(() => {
    if (csvData.length) {
      csvLink.current.link.click();
      setLoading(false);
    }
  }, [csvData]);

  const handleExport = () => {
    setLoading(true);
    const kitsSortedByDescription = componentExceptionSkusList
      ?.slice()
      .sort((a, b) => {
        const kitItemCodeA = a.Kit_Item_Code?.trim()?.toUpperCase();
        const kitItemCodeB = b.Kit_Item_Code?.trim()?.toUpperCase();

        if (kitItemCodeA > kitItemCodeB) return 1;
        if (kitItemCodeA < kitItemCodeB) return -1;
        return 0;
      });

    let kits = uniq(
      kitsSortedByDescription?.map((item: IExceptionSkuListRow) =>
        item.Kit_Item_Code?.trim()
      ) || []
    );

    // kits = _.sortBy(kits, ["Kit_Item_Code", "Component_Item_Code"]);
    const dataSource = kits?.reduce((data, sku) => {
      let skuList = kitsSortedByDescription.filter(
        (item) => item.Kit_Item_Code === sku
      );
      // skuList = _.sortBy(skuList, ["Kit_Item_Code", "Component_Item_Code"]);

      const skuData =
        skuList?.map((item: IExceptionSkuListRow) => ({
          product: `${item.Kit_Item_Code}: ${item.Item_Description_Kit}`,
          componentNumber: `${item.Component_Sequence_No}`,
          component: `${item.Component_Item_Code}: ${item.Item_Description_Comp}`,
        })) || [];

      return [...data, ...skuData];
    }, [] as ITableDataSource[]);

    setCsvData(dataSource);
    // csvLink?.current?.link?.click();
  };

  const ComponentToPrint = forwardRef<HTMLDivElement, IPrintProps>(
    function ComponentToPrint({ columns, dataSource }, ref) {
      const dateTime = moment().format("DD/MM/YYYY HH:mm");

      return (
        <div className={`${styles.printTableContainer}`} ref={ref}>
          <div className={`${styles.showOnPrint}`}>
            <FormLabel>{dateTime}</FormLabel>
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
          <div className=" mt-5">
            <MultiBoxProductTable
              rowSelection={false}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered={true}
            />
          </div>
        </div>
      );
    }
  );

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Multi Box Product", [key]: "product" },
      { [label]: "No.", [key]: "componentNumber" },
      { [label]: "Component", [key]: "component" },
    ];
    return headers;
  };

  const columns = [
    {
      title: "Multi Box Product",
      dataIndex: "product",
      key: "product",
      render: (value: any, record: ITableDataSource) => (
        <span>{record.product}</span>
      ),
      width: 400,
    },
    {
      align: "center",
      title: "No.",
      dataIndex: "componentNumber",
      key: "componentNumber",
      width: 50,
      render: (value: any, record: ITableDataSource) => (
        <span>{`${record.componentNumber}`}</span>
      ),
    },
    {
      align: "left",
      title: "Component",
      dataIndex: "component",
      key: "component",
      width: 400,
      render: (value: any, record: ITableDataSource) => (
        <span>{`${record.component}`}</span>
      ),
    },
  ];

  let dataSource: any[] = [];

  // prepare table data and sort in ac
  const kits = uniq(
    componentExceptionSkusList?.map(
      (item: IExceptionSkuListRow) => item.Kit_Item_Code
    ) || []
  ).sort((a, b) => a.localeCompare(b));

  dataSource =
    kits?.reduce((data, sku: string) => {
      const skuList = componentExceptionSkusList.filter(
        (item) => item.Kit_Item_Code === sku
      );

      const rowsToRender = skuList.reduce((acc, curr, index) => {
        const product =
          index === 0
            ? `${curr.Kit_Item_Code}: ${curr.Item_Description_Kit}`
            : "";

        const componentNumber = `${curr.Component_Sequence_No}`;
        const component = `${curr.Component_Item_Code}: ${curr.Item_Description_Comp}`;

        return [...acc, { product, componentNumber, component }];
      }, [] as ITableDataSource[]);

      return [...data, ...rowsToRender];
    }, [] as ITableDataSource[]) || [];

  return (
    <div>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:h-10 lg:w-30 border-0  font-bold tracking-wide mt-5"
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 280,
        }}
        onClick={onBack}
        title="Back"
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:h-10 lg:w-30 border-0  font-bold tracking-wide mt-5 position-absolute top-1 right-40 z-50"
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 145,
        }}
        onClick={handlePrint}
        title="Print"
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 "
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 10,
          background: theme?.primaryNight,
        }}
        disabled={loading}
        onClick={handleExport}
        title="Export"
      />
      <CSVLink
        data={csvData}
        headers={makeHeaders("label", "key")}
        filename={"multi-box-routing.csv"}
        ref={csvLink}
      />

      <div className="mt-1 flex justify-center flex-column align-items-center">
        {multiBoxLoading ? (
          <div className=" p-5">
            <Spin
              // @ts-ignore
              tip={<FormLabel className=" ml-4">Loading ...</FormLabel>}
            />
          </div>
        ) : null}

        {dataSource.length && !multiBoxLoading ? (
          <ComponentToPrint
            columns={columns}
            dataSource={dataSource}
            ref={tableToPrint}
          />
        ) : null}

        {!dataSource.length && !multiBoxLoading ? (
          <div className="text-center">
            <h4
              style={{ color: theme?.mono }}
              className="text-sm text-center font-medium"
            >
              No data found
            </h4>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MultiBoxProductsView;
