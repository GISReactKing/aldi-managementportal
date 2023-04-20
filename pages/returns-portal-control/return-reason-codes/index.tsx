/** @format */
import { useState } from "react";
import { Tag, Typography } from "antd";
import UserDashboard from "../../../components/UserDashboard";
import SearchInput from "../../../components/SearchInput";
import { Table, Button, Layout } from "antd";
import styles from "./index.module.scss";
import { Row, Col } from "react-bootstrap";
import EditReturnReasonModal from "../../../components/Modals/EditReturnReasonModal";
import { RootStateOrAny, useSelector } from "react-redux";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";

const { Text } = Typography;
interface Props {}
interface DataType {
  key: React.Key;
  name: string;
  reasons: string;
  status: string;
}

const ReturnReasonCode = ({}: Props): JSX.Element => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );
  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Returns Portal Control",
    "Return Reason Codes",
  ]);

  const columns = [
    {
      title: "Reason Code",
      dataIndex: "name",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Category 1",
          value: "Category 1",
          children: [
            {
              text: "Yellow",
              value: "Yellow",
            },
            {
              text: "Pink",
              value: "Pink",
            },
          ],
        },
        {
          text: "Category 2",
          value: "Category 2",
          children: [
            {
              text: "Green",
              value: "Green",
            },
            {
              text: "Black",
              value: "Black",
            },
          ],
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value: any, record: any) => record.name.includes(value),
      width: "25%",
    },
    {
      title: "Reasons",
      dataIndex: "reasons",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Category 1",
          value: "Category 1",
          children: [
            {
              text: "Yellow",
              value: "Yellow",
            },
            {
              text: "Pink",
              value: "Pink",
            },
          ],
        },
        {
          text: "Category 2",
          value: "Category 2",
          children: [
            {
              text: "Green",
              value: "Green",
            },
            {
              text: "Black",
              value: "Black",
            },
          ],
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value: any, record: any) => record.reasons.includes(value),
      width: "60%",
    },
    {
      title: "Status",
      sorter: (a: any, b: any) => a.status.length - b.status.length,
      showSorterTooltip: false,
      width: "20%",
      dataIndex: "status",
      render: (text: string, recode: any) => {
        return (
          <>
            <Text
              className={
                text === "Active"
                  ? styles["statusActive"]
                  : styles["statusInactive"]
              }
              key={text}
            >
              {text}
            </Text>
          </>
        );
      },
    },
  ];
  const data = [
    {
      key: "1",
      name: "1010",
      reasons: "Change of mind",
      status: "Active",
    },
    {
      key: "2",
      name: "1002",
      reasons: "Change of mind",
      status: "Inactive",
    },
    {
      key: "3",
      name: "1003",
      reasons: "Returning a Gift",
      status: "Active",
    },
    {
      key: "4",
      name: "1005",
      reasons: "Poor Quality",
      status: "Active",
    },
    {
      key: "5",
      name: "1077 ",
      reasons: "Change of mind",
      status: "Inactive",
    },
    {
      key: "6",
      name: "1007",
      reasons: "Change of mind",
      status: "Inactive",
    },
    {
      key: "7",
      name: "9999",
      reasons: "Product Faulty",
      status: "Active",
    },
    {
      key: "8",
      name: "7555",
      reasons: "Change of mind",
      status: "Active",
    },
  ];

  const [dataState, setDataState] = useState(data);
  const { Content } = Layout;

  const onChangeText = (e: any) => {
    console.log("🚀 ~ file: index.tsx ~ line 18 ~ onChangeText ~ e", e);
  };

  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
  }
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <UserDashboard>
      <>
        <AppButton
          className={`${styles.addButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
          onClick={() => {
            setEditModal(true);
          }}
          title="Add"
          disabled={CUDDisabled}
        />
        <AppButton
          className={`${styles.exportButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
          title="Export"
          onClick={() => {}}
        />
      </>
      <Content className={styles.content}>
        <SearchInput
          value={""}
          searchIcon={true}
          placeholder="Search"
          onChange={(e) => onChangeText(e)}
        />

        <Row style={{ marginTop: "20px" }}>
          <Col md={6}>
            <Table
              columns={[]}
              dataSource={data}
              onChange={onChange}
              rowSelection={rowSelection}
            />
          </Col>
        </Row>
      </Content>
      <EditReturnReasonModal
        show={editModal}
        onHide={() => setEditModal(false)}
      />
    </UserDashboard>
  );
};

export default ReturnReasonCode;
