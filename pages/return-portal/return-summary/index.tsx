import { Button } from "antd";
import { Table, Radio, Space, Grid, Divider } from "antd";
import { useState } from "react";
import ReturnPortalContainer from "../../../components/ReturnPortalContainer";
import { useRouter } from "next/router";
import DropOffSelectors from "./drop-off-selector";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import useTheme from "../../../hooks/useTheme";

const { useBreakpoint } = Grid;
interface Props {}

const data = [
  {
    key: "1",
    product: "Tomatoes Feed 1L",
    quantity: 2,
    value: 43.25,
  },
  {
    key: "1",
    product: "Tomatoes Feed 1L",
    quantity: 2,
    value: 43.25,
  },
  {
    key: "1",
    product: "Tomatoes Feed 1L",
    quantity: 2,
    value: 43.25,
  },
];

const columns: any = [
  {
    title: "Product",
    dataIndex: "product",
    key: "1",
    render: (text: string, recode: any, index: number) => (
      <>
        <span
          className={`${
            index + 1 === data.length ? "text-primary-night" : ""
          } text-sm`}
        >
          {text}
        </span>
      </>
    ),
  },
  {
    title: "Quantity",
    align: "center",
    dataIndex: "quantity",
    key: "2",
    render: (text: string, recode: any, index: number) => (
      <>
        <span
          className={`${
            index + 1 === data.length ? "text-primary-night" : ""
          } text-sm`}
        >
          {text}
        </span>
      </>
    ),
  },
  {
    title: "Value",
    dataIndex: "value",
    align: "center",
    key: "3",
    render: (text: string, recode: any) => (
      <>
        <span>£ {ComaSeparator(text)}</span>
      </>
    ),
  },
];

const ReturnSummary = (props: Props) => {
  const theme = useTheme();
  const { md } = useBreakpoint();
  const router = useRouter();

  const onClick = (path: string) => {
    router.push(path);
  };

  const [dropOff, setDropOff] = useState<any>("");

  return (
    <ReturnPortalContainer
      btnText2={"Finish Return"}
      btnOnClick2={() => console.log("btnOnClick2")}
    >
      <div className="xsm:px-4 md:px-28">
        <div className="flex align-items-center flex-col-reverse md:flex-row mt-10">
          <Button
            style={{
              borderColor: theme?.primaryNight,
              color: theme?.primaryNight,
            }}
            className="mr-2 rounded w-full md:w-auto mt-5 md:mt-0"
            type="default"
          >
            Edit
          </Button>
          <span className="flex-grow text-center align-items-center">
            <h3 className="text-lg font-medium">Return Summary</h3>
            <p style={{ color: theme?.mono }} className="text-sm mt-1">
              Here’s a summary. How would you like to process returns?
            </p>
          </span>
        </div>

        <div className="flex justify-between flex-col md:flex-row mt-14">
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              Customer Information:
            </h3>
            <p
              style={{ color: theme?.mono }}
              className="text-sm mt-0.5 mt-2 text-sm"
            >
              John Jones
            </p>
            <p
              style={{ color: theme?.mono }}
              className="text-sm mt-0.5 mt-2 text-sm"
            >
              Delivery Address: 99 New Road, Birmigham, B109YZ
            </p>
            <p
              style={{ color: theme?.mono }}
              className="text-sm mt-0.5 mt-2 text-primary-sea underline text-sm"
            >
              johnjones@gmail.com
            </p>
            <p
              style={{ color: theme?.mono }}
              className="text-sm mt-0.5 mt-2 text-sm"
            >
              (44) 076 541 2331
            </p>
          </div>
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold text-left md:text-right mt-4 md:mt-0"
            >
              Order Information:
            </h3>
            <p
              style={{ color: theme?.mono }}
              className="text-sm mt-0.5 text-left md:text-right text-sm mt-2"
            >
              Order No: 5123457
            </p>
            <p
              style={{ color: theme?.mono }}
              className="text-sm mt-0.5 text-left md:text-right text-sm mt-2"
            >
              Order Date: 01/12/2021
            </p>
          </div>
        </div>

        <div className="flex justify-between flex-col md:flex-row mt-10">
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              Small Items
            </h3>
            <Table
              className="return-table mt-6"
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered={false}
            />
          </div>
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              How would you like to Return?
            </h3>
            <div className="mt-6">
              <Radio.Group>
                <Space direction={!md ? "vertical" : "horizontal"}>
                  <Radio value={1}>Drop-Off</Radio>
                  <Radio value={2}>
                    Arrange Collection (A printer is needed)
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            <DropOffSelectors />
          </div>
        </div>
        <Divider />
        <div className="flex justify-between flex-col md:flex-row mt-10">
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              Large or Heavy Items
            </h3>
            <Table
              className="return-table mt-6"
              columns={columns}
              dataSource={[
                {
                  key: "1",
                  product: "Tomatoes Feed 1L",
                  quantity: 2,
                  value: 43.25,
                },
              ]}
              pagination={false}
              bordered={false}
            />
          </div>
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              How would you like to Return?
            </h3>
            <div style={{ width: "388px" }} className="mt-6">
              <Radio.Group>
                <Space direction={!md ? "vertical" : "horizontal"}>
                  <Radio value={1}>Drop-Off</Radio>
                  <Radio value={2}>Arrange Collection</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex justify-between flex-col md:flex-row mt-8">
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              We will refund the following items not received:
            </h3>
            <Table
              className="return-table"
              columns={columns}
              dataSource={[
                {
                  key: "1",
                  product: "Tomatoes Feed 1L",
                  quantity: 2,
                  value: 43.25,
                },
              ]}
              pagination={false}
              bordered={false}
            />
          </div>
        </div>
        <Divider />
        <div className="flex justify-between flex-col md:flex-row mt-8">
          <div>
            <h3
              style={{ color: theme?.monoTitle }}
              className="text-sm font-bold"
            >
              We will refund the items below, but you do not need to return
              these:
            </h3>
            <Table
              className="return-table"
              columns={columns}
              dataSource={[
                {
                  key: "1",
                  product: "Tomatoes Feed 1L",
                  quantity: 2,
                  value: 43.25,
                },
              ]}
              pagination={false}
              bordered={false}
            />
          </div>
        </div>
        <Divider />
        <div className="flex   mt-8">
          <h3 style={{ color: theme?.monoTitle }} className="text-sm font-bold">
            Total Return Value
          </h3>
          <h1
            style={{ color: theme?.monoTitle }}
            className=" ml-6 md:ml-64  text-sm font-bold"
          >
            £ {ComaSeparator(150.25)}
          </h1>
        </div>
      </div>
    </ReturnPortalContainer>
  );
};

export default ReturnSummary;
