import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { Button, Radio, Space } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { RootStateOrAny, useSelector } from "react-redux";
import styles from "./multi-box-products.module.scss";
import UserDashboard from "../../../components/UserDashboard";
import ExceptionWarringModal from "../../../components/CustomModal";
import MultiBoxProductTable from "../../../components/Table";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import useTheme from "../../../hooks/useTheme";

interface Props {}

const MultiBoxProductsRouting = (props: Props) => {
  const theme = useTheme();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [radioCheckedValue, setRadioCheckedValue] = useState<string>("");
  const [exceptions, setExceptions] = useState<string>(
    "Route All Multi Box Components Via the Same Carrier"
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Multi Box Products: Routing",
  ]);

  const onChange = (e: any) => {
    setIsModal(true);
    setRadioCheckedValue(e.target.value);
  };

  const onConfirm = () => {
    setExceptions(radioCheckedValue);
    setIsModal(false);
  };

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const headerCol = [
    {
      title: "Multi Box Products",
      dataIndex: "multi_box_products",
      key: "multi_box_products",
    },
    {
      align: "right",
      title: "Components",
      dataIndex: "components",
      key: "components",
      width: 20,
    },
  ];

  const data = [
    {
      multi_box_products: "8783947598745: Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      components: 1,
    },
    {
      multi_box_products: "8783947598745: Abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      components: 4,
    },
    {
      multi_box_products: "8783947598745: Acccccccccccccccccccccccccccccc",
      components: 9,
    },
  ];

  return (
    <UserDashboard>
      <AppButton
        className="xsm:h-9 lg:h-10 lg:w-30 border-0  font-bold tracking-wide mt-5 position-absolute top-0 right-40 z-50"
        // type='primary'
        // style={{ background: '#54C2F0', borderRadius: '4px' }}
        onClick={() => {
          console.log("Edit");
        }}
        title="Edit"
        disabled={CUDDisabled}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-0 right-4 z-50"
        // type='primary'
        // style={{ background: '#54C2F0', borderRadius: '4px' }}
        onClick={() => handlePrint()}
        title="Print"
      />
      <h1
        style={{ color: theme?.mono }}
        className="text-md font-bold text-center"
      >
        Multi Box Products: Routing
      </h1>

      <div className="mt-8 flex justify-center" ref={componentToPrintRef}>
        <span>
          <h4 style={{ color: theme?.mono }} className="text-sm font-medium">
            Applicable to all Multi Box Products, not listed as sku specific
            exception:
          </h4>
          <p
            style={{ color: theme?.mono }}
            className="text-sm font-normal mt-2 ml-2"
          >
            <p>For an Order Line:</p>
            <Radio.Group
              onChange={onChange}
              value={exceptions}
              className="ml-4 mt-2"
            >
              <Space direction="vertical">
                <Radio
                  value={"Route All Multi Box Components Via the Same Carrier"}
                >
                  Route All Multi Box Components Via the Same Carrier
                </Radio>
                <Radio
                  value={
                    "Route by the one or more carriers, that best suits each component"
                  }
                >
                  Route by the one or more carriers, that best suits each
                  component
                </Radio>
              </Space>
            </Radio.Group>
          </p>
          <br />
          <p style={{ color: theme?.mono }} className="text-sm font-medium">
            SKU Specific Exceptions:
          </p>
          <span style={{ color: theme?.primarySea }} className="ml-6 mt-1">
            {exceptions}
          </span>
          <Form>
            <Form.Group
              className="mr-5 ml-6 flex flex-col "
              controlId="value_name"
            >
              <span>
                <Form.Control
                  style={{ width: "200px" }}
                  className={styles.inputFiledStyle}
                  name="value_name"
                  // value={}
                  // onChange={handleChange}
                  maxLength={40}
                  placeholder="Enter research character"
                />
              </span>
              <span className="h-12 pt-1 w-full flex justify-between ">
                <div>
                  <Button
                    className="border-0 font-bold tracking-wide  mt-3 z-50"
                    type="primary"
                    style={{
                      background: theme?.primarySea,
                      borderRadius: "4px",
                    }}
                    onClick={() => {
                      console.log("add");
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    className=" font-bold tracking-wide mt-3 ml-2 border-0 z-50"
                    type="primary"
                    style={{
                      background: theme?.primarySea,
                      borderRadius: "4px",
                    }}
                    onClick={() => console.log("Remove")}
                  >
                    Remove
                  </Button>
                </div>
                <Button
                  className=" font-bold tracking-wide mt-3 border-0  border-0 z-50 "
                  type="primary"
                  style={{
                    backgroundColor: theme?.primarySea,
                    borderRadius: "4px",
                  }}
                  onClick={() => console.log("Show Grid View")}
                >
                  Show Grid View
                </Button>
              </span>
            </Form.Group>
          </Form>
          <ExceptionWarringModal
            onCloseModal={() => setIsModal(false)}
            showModal={isModal}
          >
            <div className="p-3 flex justify-center flex-col">
              <WarningOutlined className="text-xlg text-center" />
              <p className="text-md mt-4">
                The List of SKU Specific Exceptions will be erased
              </p>
            </div>
            <div className="flex justify-center p-4">
              <Button
                className="xsm:h-9 lg:h-10 lg:w-30 border-0 mr-2  font-bold tracking-wide  z-50"
                type="primary"
                style={{ background: theme?.primarySea, borderRadius: "4px" }}
                onClick={() => setIsModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 ml-2 font-bold tracking-wide border-0  z-50"
                type="primary"
                style={{ background: theme?.primarySea, borderRadius: "4px" }}
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </div>
          </ExceptionWarringModal>
          <div
            style={{ borderColor: theme?.monoBorder }}
            className="border-1 mt-4 w-full rounded"
          >
            <MultiBoxProductTable
              rowSelection={false}
              columns={headerCol}
              dataSource={data}
              pagination={false}
              bordered={true}
            />
          </div>
        </span>
      </div>
    </UserDashboard>
  );
};

export default MultiBoxProductsRouting;
