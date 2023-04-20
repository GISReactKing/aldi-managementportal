/** @format */

import { Table, Typography, Tag, Space } from "antd";
import { Form } from "react-bootstrap";
import { AlignType } from "rc-table/lib/interface";
// @ts-ignore
import styles from "../CarrierPricesTable/carrier-prices-table.module.scss";
import { useEffect, useState } from "react";

type Item = {
  label: string;
};

interface TableComponentProps {
  dataSource?: any;
  columns?: any;
  loading?: any;
  scroll?: any;
  pagination?: any;
  ellipsis?: any;
  bordered?: boolean;
  sortOrder?: any;
  rowSelection?: any;
  setRolesAndPermissionData?: any;
  loadData?: any;
  checkStatusForSaveButton?: any;
  isAdministrator?: boolean;
  isRole?: boolean;
  isIForce?: boolean;
  wasClicked?: string;
  setWasClicked?: any;
  setNoChanges?: any;
  roleValidation?: boolean;
  setRolesAndPermissionClicked: any;
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

// @ts-ignore
export default function TableComponent({
  dataSource = null,
  loading = false,
  scroll = { x: 1000 },
  bordered = false,
  setRolesAndPermissionData,
  loadData = {},
  checkStatusForSaveButton,
  isAdministrator = true,
  isRole = false,
  isIForce = false,
  wasClicked = "",
  setWasClicked,
  setNoChanges,
  roleValidation,
  setRolesAndPermissionClicked,
}: TableComponentProps) {
  const [resultData, setResultData] = useState<any>({});

  const [realData, setRealData] = useState<any>([
    {
      key: 1,
      label: "Set Up & Control",
      isParent: true,
      children: [
        {
          key: 11,
          label: "Client Administration",
          isParent: true,
          children: [
            {
              key: 111,
              label: "Client List",
            },
            {
              key: 112,
              label: "Client Menu Options",
            },
          ],
        },
        {
          key: 12,
          label: "User Administration",
          isParent: true,
          children: [
            {
              key: 121,
              label: "Roles & Permissions",
            },
            {
              key: 122,
              label: "Manage Users",
            },
            {
              key: 123,
              label: "Activate Users",
            },
            {
              key: 124,
              label: "User Activity - Overview",
            },
          ],
        },
      ],
    },
    {
      key: 2,
      label: "Carrier Routing Control",
      isParent: true,
      children: [
        {
          key: 21,
          label: "Carrier Prices",
        },
        {
          key: 22,
          label: "Carrier: Active Dates",
        },
        {
          key: 23,
          label: "Carrier: Parcel Limits",
        },
        {
          key: 24,
          label: "Carrier Capacity Set Up",
        },
        {
          key: 25,
          label: "Product Fixed Routing: by SKU",
        },
        {
          key: 26,
          label: "Product Fixed Routing: by Region",
        },
        {
          key: 27,
          label: "Multi Box Products: Routing",
        },
      ],
    },
    {
      key: 3,
      label: "Returns Portal Control",
      isParent: true,
      children: [
        {
          key: 31,
          label: "Returns Portal Rules",
        },
        {
          key: 32,
          label: "Returns Options: Routing Rules",
        },
        {
          key: 33,
          label: "Return Reason Codes",
        },
      ],
    },
    {
      key: 4,
      label: "Invoice Reconciliation",
    },
    {
      key: 5,
      label: "Reports & Enquiries",
      isParent: true,
      children: [
        {
          key: 51,
          label: "Order & Returns Enquiry",
        },
        {
          key: 52,
          label: "Parcel Delivery Status",
        },
        {
          key: 53,
          label: "Carrier Dashboard",
        },
        {
          key: 54,
          label: "Carrier Routing Exceptions",
        },
        {
          key: 55,
          label: "Returns Dashboard",
        },
        {
          key: 56,
          label: "Returns Trend Report",
        },
      ],
    },
  ]);

  const loadUserPermissionData = () => {
    // if (Object.keys(loadData).length === 0) {
    //   return null;
    // }
    let tempData = JSON.parse(JSON.stringify(resultData));
    for (const key1 in tempData) {
      const item1 = tempData[key1];
      if (
        Object.keys(item1).includes("Read Only") ||
        Object.keys(item1).includes("Create / Edit")
      ) {
        if (loadData && loadData[key1]) {
          tempData[key1] = JSON.parse(JSON.stringify(loadData[key1]));
        }
      } else {
        for (const key2 in item1) {
          const item2 = item1[key2];
          if (
            Object.keys(item2).includes("Read Only") ||
            Object.keys(item2).includes("Create / Edit")
          ) {
            if (loadData && loadData[key1] && loadData[key1][key2]) {
              tempData[key1][key2] = JSON.parse(
                JSON.stringify(loadData[key1][key2])
              );
            }
          } else {
            for (const key3 in item2) {
              const item3 = item2[key3];
              if (
                Object.keys(item3).includes("Read Only") ||
                Object.keys(item3).includes("Create / Edit")
              ) {
                if (
                  loadData &&
                  loadData[key1] &&
                  loadData[key1][key2] &&
                  loadData[key1][key2][key3]
                ) {
                  tempData[key1][key2][key3] = JSON.parse(
                    JSON.stringify(loadData[key1][key2][key3])
                  );
                }
              }
            }
          }
        }
      }
    }

    return tempData;
  };

  useEffect(() => {
    const tempData = loadUserPermissionData();
    setResultData(JSON.parse(JSON.stringify(tempData)));
    setRolesAndPermissionData(JSON.parse(JSON.stringify(tempData)));

    checkStatusForSaveButton(JSON.parse(JSON.stringify(tempData)));
  }, [loadData]);

  useEffect(() => {
    resetResultData();
  }, []);

  const setInCaseIsAdministrator = () => {
    let tempData: any = {};
    realData.map((item1: any) => {
      const label1 = item1.label;
      if (item1.children) {
        tempData[label1] = {};
        item1.children.map((item2: any) => {
          const label2 = item2.label;
          if (item2.children) {
            tempData[label1][label2] = {};
            item2.children.map((item3: any) => {
              const label3 = item3.label;
              tempData[label1][label2][label3] = {
                "Read Only": false,
                "Create / Edit": true,
              };
            });
          } else {
            tempData[label1][label2] = {
              "Read Only": false,
              "Create / Edit": true,
            };
          }
        });
      } else {
        tempData[label1] = { "Read Only": false, "Create / Edit": true };
      }
    });
    setResultData(tempData);
    setRolesAndPermissionData(tempData);

    checkStatusForSaveButton(tempData);
  };

  const resetResultData = () => {
    let tempData: any = {};
    realData.map((item1: any) => {
      const label1 = item1.label;
      if (item1.children) {
        tempData[label1] = {};
        item1.children.map((item2: any) => {
          const label2 = item2.label;
          if (item2.children) {
            tempData[label1][label2] = {};
            item2.children.map((item3: any) => {
              const label3 = item3.label;
              tempData[label1][label2][label3] = {
                "Read Only": false,
                "Create / Edit": false,
              };
            });
          } else {
            tempData[label1][label2] = {
              "Read Only": false,
              "Create / Edit": false,
            };
          }
        });
      } else {
        tempData[label1] = { "Read Only": false, "Create / Edit": false };
      }
    });
    setResultData(tempData);
    setRolesAndPermissionData(tempData);

    checkStatusForSaveButton(tempData);
  };

  useEffect(() => {
    if (isAdministrator) {
      setInCaseIsAdministrator();
    } else {
      if (wasClicked === "isAdministrator") {
        resetResultData();
        // setResultData({});
        // setRolesAndPermissionData({});
        // checkStatusForSaveButton({});

        if (isRole) {
          setWasClicked("isRole");
        }
      } else {
        // let tempData: any = JSON.parse(JSON.stringify(resultData));
        let tempData = loadUserPermissionData();
        if (tempData && Object.keys(tempData).includes("Set Up & Control")) {
          if (isRole) {
            tempData["Set Up & Control"]["User Administration"] = {
              "Client List": { "Read Only": false, "Create / Edit": false },
              "Roles & Permissions": {
                "Read Only": false,
                "Create / Edit": false,
              },
              "Manage Users": { "Read Only": false, "Create / Edit": false },
              "User Activity - Overview": {
                "Read Only": false,
                "Create / Edit": false,
              },
            };

            setWasClicked("isRole");
            setResultData(tempData);
            setRolesAndPermissionData(tempData);
            checkStatusForSaveButton(tempData);
          }
        }
      }
    }
  }, [isAdministrator, isRole, isIForce]);

  const handlerCheckbox = (item: any, target: any, propertyName: string) => {
    if (isAdministrator) {
      setInCaseIsAdministrator();
      return;
    }
    setRolesAndPermissionClicked(true);
    const keyArrayTemp: any = Array.from(item.key.toString());

    const keyArray = keyArrayTemp.map(function (value: number) {
      return value - 1;
    });

    let data: any = JSON.parse(JSON.stringify(resultData));

    if (keyArray.length > 0) {
      const mainLabel = realData[parseInt(keyArray[0])].label;
      if (!(mainLabel in data)) {
        data[mainLabel] = {};
      }

      if (keyArray.length > 1) {
        const secondLabel =
          realData[parseInt(keyArray[0])].children[parseInt(keyArray[1])].label;
        if (!(secondLabel in data[mainLabel])) {
          data[mainLabel][secondLabel] = {};
        }

        if (keyArray.length > 2) {
          const thirdLabel =
            realData[parseInt(keyArray[0])].children[parseInt(keyArray[1])]
              .children[parseInt(keyArray[2])].label;
          if (!(thirdLabel in data[mainLabel][secondLabel])) {
            data[mainLabel][secondLabel][thirdLabel] = {};
          }

          data[mainLabel][secondLabel][thirdLabel][propertyName] =
            target.checked;
          if (propertyName === "Read Only") {
            data[mainLabel][secondLabel][thirdLabel]["Create / Edit"] = false;
          } else if (propertyName === "Create / Edit") {
            data[mainLabel][secondLabel][thirdLabel]["Read Only"] = false;
          }
          // if (data[mainLabel][secondLabel][thirdLabel]["Read Only"]) {
          //   data[mainLabel][secondLabel][thirdLabel]["Create / Edit"] = false;
          // }
        } else {
          data[mainLabel][secondLabel][propertyName] = target.checked;
          if (propertyName === "Read Only") {
            data[mainLabel][secondLabel]["Create / Edit"] = false;
          } else if (propertyName === "Create / Edit") {
            data[mainLabel][secondLabel]["Read Only"] = false;
          }
          // if (data[mainLabel][secondLabel]["Read Only"]) {
          //   data[mainLabel][secondLabel]["Create / Edit"] = false;
          // }
        }
      } else {
        data[mainLabel][propertyName] = target.checked;
        if (propertyName === "Read Only") {
          data[mainLabel]["Create / Edit"] = false;
        } else if (propertyName === "Create / Edit") {
          data[mainLabel]["Read Only"] = false;
        }
        // if (data[mainLabel]["Read Only"]) {
        //   data[mainLabel]["Create / Edit"] = false;
        // }
      }
    }

    setResultData(data);
    setRolesAndPermissionData(data);

    checkStatusForSaveButton(data);
    setNoChanges(false);
  };

  const isChecked = (item: any, propertyName: string) => {
    if (Object.keys(resultData).length === 0) {
      return false;
    }

    const keyArrayTemp: any = Array.from(item.key.toString());
    const keyArray = keyArrayTemp.map(function (value: number) {
      return value - 1;
    });

    if (keyArray.length > 0) {
      const mainLabel = realData[parseInt(keyArray[0])].label;
      if (!(mainLabel in resultData)) {
        return false;
      }

      if (keyArray.length > 1) {
        const secondLabel =
          realData[parseInt(keyArray[0])].children[parseInt(keyArray[1])].label;
        if (!(secondLabel in resultData[mainLabel])) {
          return false;
        }

        if (keyArray.length > 2) {
          const thirdLabel =
            realData[parseInt(keyArray[0])].children[parseInt(keyArray[1])]
              .children[parseInt(keyArray[2])].label;
          if (!(thirdLabel in resultData[mainLabel][secondLabel])) {
            return false;
          }
          return resultData[mainLabel][secondLabel][thirdLabel][propertyName];
        }

        return resultData[mainLabel][secondLabel][propertyName];
      }

      return resultData[mainLabel][propertyName];
    }

    return false;
  };

  const columnsExample = [
    {
      title: "Title",
      dataIndex: "label",
      key: "title",
    },
    {
      title: "Read Only",
      key: "read_only",
      dataIndex: "",
      render: (item: any) => {
        if (!item.isParent) {
          let checkedStatus: any = isChecked(item, "Read Only");
          let disabled = false;
          if (isAdministrator) {
            checkedStatus = false;
            disabled = false;

            if (item.key.toString().substring(0, 3) === "111") {
              checkedStatus = false;
              disabled = true;
            }
          } else {
            if (isRole) {
              if (item.key.toString().substring(0, 2) === "11") {
                checkedStatus = false;
                disabled = true;
              }
            }
          }
          return (
            <Form.Check
              type="checkbox"
              checked={checkedStatus}
              disabled={roleValidation ? disabled : true}
              onChange={({ target }) =>
                handlerCheckbox(item, target, "Read Only")
              }
            />
          );
        }
        return "";
      },
      align: "center" as AlignType,
      width: 120,
    },
    {
      title: "Create / Edit",
      key: "create_edit",
      dataIndex: "",
      render: (item: any) => {
        if (item.key === 111) {
          return "";
        }
        if (!item.isParent) {
          let checkedStatus: any = isChecked(item, "Create / Edit");
          let disabled = false;
          if (isAdministrator) {
            checkedStatus = true;
            disabled = false;

            if (item.key.toString().substring(0, 3) === "111") {
              checkedStatus = false;
              disabled = true;
            }
          } else {
            if (isRole) {
              if (item.key.toString().substring(0, 2) === "11") {
                checkedStatus = false;
                disabled = true;
              }
            }
          }
          return (
            <Form.Check
              type="checkbox"
              checked={checkedStatus}
              disabled={roleValidation ? disabled : true}
              onChange={({ target }) =>
                handlerCheckbox(item, target, "Create / Edit")
              }
            />
          );
        }
        return "";
      },
      align: "center" as AlignType,
      width: 120,
    },
  ];

  // @ts-ignore
  return (
    <>
      <Table
        dataSource={realData}
        // rowKey={'_id'}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={false}
        // rowSelection={rowSelection}
        columns={columnsExample}
        className={`${styles.tableContent} carrier-prices-table`}
        scroll={realData.length > 20 ? { y: "calc(100vh - 360px)" } : {}}
      />
    </>
  );
}
