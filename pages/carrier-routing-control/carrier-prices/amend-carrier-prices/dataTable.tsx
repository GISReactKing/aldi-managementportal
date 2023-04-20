import React, { useEffect, useCallback } from "react";
/** @format */
import { Form, Input, Popconfirm, Table, Typography } from "antd";
import { ComaSeparator } from "../../../../utils/ComaSeparator";
import styles from "./styles.module.scss";
import moment from "moment";

import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { setRowData } from "../../../../redux/slices/CarrierPriceSlice";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

interface TableComponentProps {
  dataSource?: any;
  columns?: any;
  loading?: any;
  pagination?: any;
  bordered?: boolean;
  rowSelection?: any;
  setData: any;
  editingKey: any;
  setEditingKey: any;
  count: any;
  setCount: any;
  form: any;
  selectedDate?: any;
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
  setOnEdit?: any;
  setDisableSaveButton: any;
  primary?: any;
  pricingMethodType: string;
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  form,
  ...restProps
}: any) => {
  let boxPadding = 10;
  if (dataIndex === "base_price") boxPadding = 20;
  if (dataIndex === "increment_price") boxPadding = 20;
  const dispatch = useDispatch();
  const NO_DECIMAL_PLACES_FIELDS = [
    "from_weight",
    "weight_increments",
    "increment_start",
  ];

  return (
    <td {...restProps}>
      {editing ? (
        <>
          {dataIndex === "base_price" ? (
            <>
              <span
                style={{
                  position: "absolute",
                  bottom: 12,
                  top: 28,
                  left: 15,
                  zIndex: 30,
                }}
              >
                £
              </span>
            </>
          ) : null}

          {dataIndex === "increment_price" ? (
            <span
              style={{
                position: "absolute",
                bottom: 12,
                top: 28,
                left: 15,
                zIndex: 30,
              }}
            >
              £
            </span>
          ) : null}

          <Form.Item
            shouldUpdate
            name={dataIndex}
            id={dataIndex}
            // initialValue={rowData?.[dataIndex]}
            style={{
              margin: 0,
            }}
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                // message: "",
              },
              {
                pattern:
                  /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
                // message: "",
              },
              ({ getFieldValue }: any) => ({
                validator(_, value: any) {
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              type="text"
              min="0"
              name={dataIndex}
              value={form.getFieldsValue()?.[dataIndex]}
              step="any"
              // pattern="^\d*(\.\d{0,2})?$"
              style={{
                width: 70,
                paddingLeft: boxPadding,
              }}
              onChange={(e) => {
                let value = e.target.value;
                const leadingDecimal = value.indexOf(".") === 0;
                const decimalPosition = value.indexOf(".");
                const lastIndexOfDecimal = value.lastIndexOf(".");
                const minusSymbolAdded = value.indexOf("-");

                // if there is a decimal and the field is one of the fields
                // not requires no decimal place prevent the decimal point
                if (
                  decimalPosition > -1 &&
                  NO_DECIMAL_PLACES_FIELDS.includes(dataIndex)
                )
                  value = value.substring(0, value.length - 1);

                if (Number.isNaN(Number(value))) value = "";

                if (minusSymbolAdded > -1)
                  value = value.substring(0, minusSymbolAdded);

                if (leadingDecimal) value = "0.";

                if (
                  decimalPosition > -1 &&
                  lastIndexOfDecimal > decimalPosition
                )
                  value = value.slice(0, lastIndexOfDecimal);

                if (decimalPosition > -1)
                  value = value.slice(0, decimalPosition + 3);

                form.setFieldsValue({ [dataIndex]: value });
                dispatch(setRowData(form.getFieldsValue()));
              }}
            />
          </Form.Item>
        </>
      ) : (
        children
      )}
    </td>
  );
};

export default function TableComponent({
  dataSource,
  pagination = { position: ["bottom"], pageSize: 10 },
  bordered = true,
  setData,
  editingKey,
  setEditingKey,
  count,
  setCount,
  loading,
  form,
  onChangeTable,
  setOnEdit,
  setDisableSaveButton,
  primary,
  pricingMethodType,
  selectedDate = false,
}: TableComponentProps) {
  const isEditing = (record: any) => record.key === editingKey;

  const dispatch = useDispatch();

  const rowObj = useSelector(
    ({ carrierPrice }: RootStateOrAny) => carrierPrice?.rowData
  );

  const secondaryCosting = useSelector(
    ({ carrierPrice }: RootStateOrAny) =>
      carrierPrice?.costing?.secondaryCosting
  );

  const carrierPriceStates = useSelector(
    ({ carrierPrice }: RootStateOrAny) => carrierPrice
  );

  const { carrierPrice, permanentlyDateData, effectiveBetweenDateData } =
    carrierPriceStates;

  const dataa =
    Array.isArray(dataSource) && dataSource.length > 0 ? [...dataSource] : [];

  const sortedDataSource = dataa?.sort?.((a: any, b: any) => {
    if (a._id && a._id) return a._id - b._id;
    return 0;
  });

  useEffect(() => {
    if (
      !form.isFieldsTouched(true) ||
      !!form.getFieldsError().filter(({ errors }: any) => errors.length).length
    )
      setDisableSaveButton(true);
  }, [form]);

  const edit = (record: any) => {
    let obj = {
      _id: "",
      base_price: "",
      from_weight: "",
      increment_price: "",
      increment_start: "",
      weight_increments: "",
      ...record,
    };
    form.setFieldsValue(obj);
    dispatch(setRowData(obj));
    setEditingKey(record?.key);
  };

  const isDatesSame = () => {
    const effectiveBetween =
      carrierPrice?.costing?.secondaryCosting?.effectiveBetween;

    const effectiveFrom =
      carrierPrice?.costing?.secondaryCosting?.effectiveFrom;

    if (effectiveBetween) {
      const fromDate = effectiveBetween?.from;
      const toDate = effectiveBetween?.to;
      console.log("fromDate", fromDate);
      console.log("toDate", toDate);

      const newFromDate = moment(effectiveBetweenDateData?.[0]).format(
        "YYYY-MM-DD"
      );
      const newToDate = moment(effectiveBetweenDateData?.[1]).format(
        "YYYY-MM-DD"
      );
      if (fromDate === newFromDate && toDate === newToDate) {
        return true;
      } else {
        return false;
      }
    } else if (effectiveFrom) {
      const newDate = moment(permanentlyDateData).format("YYYY-MM-DD");
      if (effectiveFrom === newDate) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleDelete = (key: any, id: string) => {
    const dataAfterDelete = dataa.filter((item: any) => item.key !== key);
    const isDateSame = isDatesSame();
    setData(dataAfterDelete);
    const matrixObj =
      dataAfterDelete?.filter(
        (item: any) =>
          !item?._id &&
          item?.base_price &&
          item?.from_weight &&
          item?.increment_price &&
          item?.increment_start &&
          item?.weight_increments
      )?.length > 0;

    if (matrixObj || !isDateSame) {
      setOnEdit(true);
      setDisableSaveButton(false);
    } else {
      setOnEdit(false);
      setDisableSaveButton(true);
    }
  };

  const cancel = () => {
    setEditingKey("");
  };

  const pricingType =
    pricingMethodType === "By Parcel Matrix" ? "Parcel " : "Weight";

  const IsWeightMatrix = pricingMethodType === "By Weight Matrix";

  const FIELDS_WITH_DECIMAL_PLACES = ["base_price", "increment_price"];

  let columns: any = [
    {
      title: "Matrix Row #",
      dataIndex: "_id",
      key: "_id",
      className: "table-header-col",
      showSorterTooltip: false,
      align: "center",
      width: 85,
      editable: false,
      render: (item: any) => {
        return <span className="text-center">{item}</span>;
      },
    },
    {
      title: "Base Price",

      dataIndex: "base_price",
      key: "base_price",
      align: "center",
      editable: true,
      width: 85,
      render: (item: any) => {
        return (
          <span className="text-center">
            {item === null ? null : (
              <>
                £{" "}
                {ComaSeparator(
                  !Number.isNaN(Number(item)) ? Number(item).toFixed(2) : 0
                )}
              </>
            )}
          </span>
        );
      },
    },

    {
      title: `From ${pricingType}`,
      dataIndex: "from_weight",
      key: "from_weight",
      editable: true,
      align: "center",
      width: 85,
      render: (item: any) => {
        return (
          <span className="text-center">
            {item === null ? null : (
              <>
                {IsWeightMatrix
                  ? ComaSeparator(
                      !Number.isNaN(Number(item)) ? Number(item).toFixed(2) : 0
                    )
                  : Math.trunc(item)}
              </>
            )}
          </span>
        );
      },
    },
    {
      title: "Increment Price",
      dataIndex: "increment_price",
      key: "increment_price",
      align: "center",
      editable: true,
      width: 85,
      render: (item: any) => {
        return (
          <span className="text-center">
            {item === null ? null : (
              <>
                £{" "}
                {ComaSeparator(
                  !Number.isNaN(Number(item)) ? Number(item).toFixed(2) : 0
                )}
              </>
            )}
          </span>
        );
      },
    },
    {
      title: "Increment Start",
      dataIndex: "increment_start",
      key: "increment_start",
      align: "center",
      editable: true,
      width: 85,
      render: (item: any) => {
        return (
          <span className="text-center">
            {item === null ? null : (
              <>
                {IsWeightMatrix
                  ? ComaSeparator(
                      !Number.isNaN(Number(item)) ? Number(item).toFixed(2) : 0
                    )
                  : Math.trunc(item)}
              </>
            )}
          </span>
        );
      },
    },
    {
      title: `${pricingType} Increments`,
      dataIndex: "weight_increments",
      key: "weight_increments",
      align: "center",
      editable: true,
      width: 85,
      render: (item: any) => {
        return (
          <span className="text-center">
            {item === null ? null : (
              <>
                {IsWeightMatrix
                  ? ComaSeparator(
                      !Number.isNaN(Number(item)) ? Number(item).toFixed(2) : 0
                    )
                  : item}
              </>
            )}
          </span>
        );
      },
    },
  ];

  const editableColumn = {
    title: "",
    dataIndex: "operation",
    width: "auto",
    render: (_: any, record: any) => {
      const editable = isEditing(record);

      return (
        <div className="d-flex align-center items-center justify-center">
          {editable ? (
            <div className="d-flex align-center items-center justify-center">
              <Form.Item shouldUpdate>
                {() => (
                  <Typography.Link
                    onClick={() => save(record?.key)}
                    style={{
                      marginRight: 8,
                    }}
                    disabled={
                      (selectedDate && !form.isFieldsTouched(true)) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }: any) => errors.length).length
                    }
                  >
                    <CheckCircleOutlined style={{ marginTop: 24 }} />
                  </Typography.Link>
                )}
              </Form.Item>

              <Popconfirm title="Confirm Cancel?" onConfirm={cancel}>
                <CloseCircleOutlined />
              </Popconfirm>
            </div>
          ) : (
            <Typography.Link
              // disabled={editingKey !== ''}
              onClick={() => edit(record)}
              disabled={selectedDate}
              className="flex"
            >
              <EditOutlined />
            </Typography.Link>
          )}

          {dataSource.length >= 1 && !record?._id ? (
            <Popconfirm
              title="Confirm delete?"
              onConfirm={() => handleDelete(record?.key, record?._id)}
              disabled={selectedDate}
            >
              <DeleteOutlined
                style={{
                  marginLeft: 8,
                  paddingTop: 4,
                }}
              />
            </Popconfirm>
          ) : null}
        </div>
      );
    },
  };

  if (!primary) {
    columns.push(editableColumn);
  }

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();

      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      setOnEdit(true);
      setDisableSaveButton(false);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const EditCell = useCallback(
    (props: any) => <EditableCell form={form} {...props} />,
    [form]
  );

  return (
    <>
      <Form form={form} initialValues={rowObj} component={false}>
        <Table
          components={{
            body: {
              cell: EditCell,
            },
          }}
          style={{ borderStyle: "double" }}
          size={"small"}
          bordered={bordered}
          pagination={false}
          columns={mergedColumns}
          loading={loading}
          dataSource={sortedDataSource}
          // rowSelection={rowSelectionConfig}
          onChange={onChangeTable}
          rowClassName={styles.carrierPriceRowHeight}
        />
      </Form>
    </>
  );
}
