/** @format */

import { Table, Grid, Avatar, Tag } from "antd";
import { useRouter } from "next/router";
import styles from "./roles-and-permissions-table.module.scss";
import moment from "moment";
import { useDispatch } from "react-redux";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import { isEmpty } from "lodash";
import useTheme from "../../../hooks/useTheme";
const { useBreakpoint } = Grid;

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
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  actionDisabled?: boolean;
  getColumnSearchProps: (name: any) => void;
  getColumnDateSearchProps: (name: any) => void;
}

export default function TableComponent({
  dataSource,
  // columns = columnsExample,
  loading,
  scroll = { x: "max-content" },
  pagination = { position: ["bottom"], pageSize: 100000 },
  bordered = false,
  rowSelection = false,
  onDelete,
  onEdit,
  actionDisabled = false,
  getColumnSearchProps,
  getColumnDateSearchProps,
}: TableComponentProps) {
  const theme = useTheme();
  const columnsExample = [
    {
      title: "Role Name",
      dataIndex: "title",
      key: "title",
      sorter: (a: any, b: any) => a.title.localeCompare(b.title),
      ...(getColumnSearchProps("title") as any),
      render: (item: any, recode: any) => {
        return <span className="text-left">{`${recode.title}`}</span>;
      },
      // width: 130,
      defaultSortOrder: "ascend",
      showSorterTooltip: false,
      className: "string-column",
    },
    {
      title: "Client User Role",
      dataIndex: "user_role",
      key: "user_role",
      render: (item: any, recode: any) => {
        return <span className="text-left">{item ? "True" : "False"}</span>;
      },
      width: 130,
      className: "string-column",
    },
    {
      title: "Client User Administration",
      dataIndex: "user_admin",
      key: "user_admin",
      render: (item: any, recode: any) => {
        return <span className="text-left">{item ? "True" : "False"}</span>;
      },
      width: 200,
      className: "string-column",
    },
    {
      title: "Menu Options",
      render: (item: any) => {
        let number = 0;
        if (Array.isArray(item)) {
          item.map((roles: any) => {
            number += roles?.allowed ? roles.allowed.length : 0;
          });
        } else {
          if (isEmpty(item))
            return <span className="md:ml-2">{`${number}`}</span>;

          for (let i = 0; i < Object.keys(item).length; i++) {
            const name1 = Object.keys(item)[i];
            if (typeof item[name1] === "boolean" && item[name1]) {
              number++;
              break;
            }

            const obj2 = item[name1];
            if (obj2) {
              for (let j = 0; j < Object.keys(obj2).length; j++) {
                const name2 = Object.keys(obj2)[j];
                if (typeof obj2[name2] === "boolean" && obj2[name2]) {
                  number++;
                  break;
                }

                const obj3 = obj2[name2];
                if (obj3) {
                  for (let k = 0; k < Object.keys(obj3).length; k++) {
                    const name3 = Object.keys(obj3)[k];
                    if (typeof obj3[name3] === "boolean" && obj3[name3]) {
                      number++;
                      break;
                    }

                    const obj4 = obj3[name3];
                    if (obj4) {
                      for (let l = 0; l < Object.keys(obj4).length; l++) {
                        const name4 = Object.keys(obj4)[l];
                        if (typeof obj4[name4] === "boolean" && obj4[name4]) {
                          number++;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        return <span className="md:ml-2">{`${number}`}</span>;
      },
      dataIndex: "permissions",
      key: "permissions",
      align: "center",
      className: "number-column",
      width: 120,
    },
    {
      title: "Users",
      dataIndex: "user",
      key: "user",
      align: "center",
      showSorterTooltip: false,
      render: (user: any) => (user && user.length ? user.length : 0),
      className: "image-column",
      width: 80,
    },
    {
      title: "Date Created",
      sorter: (a: any, b: any) => a.created_on.localeCompare(b.created_on),
      ...(getColumnDateSearchProps("created_on") as any),
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
      dataIndex: "created_on",
      key: "created_on",
      //className: "string-column",
      // width: "15%",
      width: 150,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (item: any, recode: any) => {
        return <span className="text-left">{item ? "True" : "False"}</span>;
      },
      className: "string-column",
      width: 80,
    },
    {
      title: () => (
        <span
          style={{ color: theme?.lightGray }}
          className="text-xsm tracking-xl-wide"
        >
          Action
        </span>
      ),
      align: "center",
      dataIndex: "_id",
      key: "_id",
      render: (_id: string, record: any) => {
        return (
          <>
            {actionDisabled ? (
              <Tag
                style={{ cursor: "not-allowed", opacity: 0.5 }}
                className={`${styles[`blueButton`]}`}
                color={"blue"}
                key={"Edit Role"}
              >
                Edit Role
              </Tag>
            ) : (
              <Tag
                onClick={() => onEdit(_id)}
                className={`${styles[`blueButton`]}`}
                color={"blue"}
                style={{ cursor: "pointer" }}
                key={"Edit Role"}
              >
                Edit Role
              </Tag>
            )}
            {actionDisabled ||
            record?.by_default === true ||
            (record.user && record.user.length) ? (
              <Tag
                className={`${styles[`redButton`]}`}
                color={"red"}
                style={{ cursor: "not-allowed", opacity: 0.5 }}
                key={"Delete Role"}
              >
                Delete Role
              </Tag>
            ) : (
              <Tag
                onClick={() => onDelete(_id)}
                className={`${styles[`redButton`]}`}
                color={"red"}
                style={{ cursor: "pointer" }}
                key={"Delete Role"}
              >
                Delete Role
              </Tag>
            )}
          </>
        );
      },
      className: `button-column ${styles.hideColumnOnPrint}`,
      width: 220,
    },
  ] as any;

  return (
    <>
      <Table
        rowKey={"_id"}
        scroll={scroll}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        columns={columnsExample}
        dataSource={dataSource}
        rowSelection={rowSelection}
      />
    </>
  );
}
