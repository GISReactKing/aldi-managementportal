/** @format */

import type { NextPage } from "next";
import ReturnPortalContainer from "../../../components/ReturnPortalContainer";
import UserTable from "../../../components/Table";
import { Select, Button } from "antd";
import ActivityFilterSelector from "../../../components/Select";
import Avatar from "../../../components/Avatar";
import styles from "./itemSelection.module.scss";
import SearchInput from "../../../components/SearchInput";
import WrongItemSentModal from "../../../components/Modals/WrongItemSentModal";
import React, { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import {
  IReturnItem,
  fetchReturnItems,
  updateReturnItems,
} from "../../../redux/slices/returnItemsSlice";
import useTheme from "../../../hooks/useTheme";

const { Option } = Select;

const ItemSelection: NextPage = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const PRODUCTS = [
    {
      _id: 1,
      product_description: "Doff Tomato Feed 1L",
      available_return: "2",
      value: "€ 5.98",
      date: "03/06/2021",
      quantity: 4,
      reason: null,
      photo: "No Photo",
      information: null,
    },
    {
      _id: 2,
      product_description: "Doff Multi-Purpose Feed 1L",
      available_return: "3",
      value: "€ 5.88",
      date: "03/06/2021",
      quantity: 5,
      reason: null,
      photo: "No Photo",
      information: null,
    },
    {
      _id: 3,
      product_description: "Gordless Grass Hedge Trimmer Shears",
      available_return: "1",
      value: "€ 4.98",
      date: "03/06/2021",
      quantity: 14,
      reason: null,
      photo: "No Photo",
      information: null,
    },
    {
      _id: 4,
      product_description: "Doff Tomato Feed 1L",
      available_return: "4",
      value: "€ 4.44",
      date: "03/06/2021",
      quantity: 22,
      reason: null,
      photo: "No Photo",
      information: null,
    },
    {
      _id: 5,
      product_description: "Doff Multi-Purpose Feed 1L",
      available_return: "7",
      value: "€ 5.77",
      date: "03/06/2021",
      quantity: 1,
      reason: null,
      photo: "No Photo",
      information: null,
    },
    {
      _id: 6,
      product_description: "Gordless Grass Hedge Trimmer Shears",
      available_return: "8",
      value: "€ 5.98",
      date: "03/06/2021",
      quantity: 4,
      reason: null,
      photo: "No Photo",
      information: null,
    },
    {
      _id: 7,
      product_description: "Doff Tomato Feed 1L",
      available_return: "0",
      value: "€ 5.98",
      date: "03/06/2021",
      quantity: 3,
      reason: null,
      photo: "No Photo",
      information: null,
    },
  ];
  const REASONS = [
    "WI- Wrong Item Received",
    "DT- Arrived Damaged",
    "OT- Others",
    "Expected Item- Not Received",
  ];

  const [wrongItemSentModalShow, setWrongItemSentModalShow] =
    useState<boolean>(false);
  const [returnProducts, setReturnProducts] = useState<any>([]);

  const returnItems: IReturnItem[] = useSelector(
    ({ returnItems }: RootStateOrAny) => returnItems.returnItemsData
  );

  useEffect(() => {
    dispatch(fetchReturnItems());
  }, []);

  useEffect(() => {
    setReturnProducts(returnItems);
  }, [returnItems]);

  const usersColumns = [
    {
      title: "Product Description",
      dataIndex: "product_description",
      key: "product_description",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.product_description - b.product_description,
      showSorterTooltip: false,
    },
    {
      title: "Available To Return",
      dataIndex: "available_return",
      key: "available_return",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.available_return - b.available_return,
      showSorterTooltip: false,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.value - b.value,
      showSorterTooltip: false,
    },
    {
      title: "Dispatch Date",
      dataIndex: "date",
      key: "date",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.date - b.date,
      showSorterTooltip: false,
    },
    {
      title: "Return Quantity",
      dataIndex: "return_quantity",
      key: "return_quantity",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.return_quantity - b.return_quantity,
      showSorterTooltip: false,
      render: (item: any, record: any) => {
        return (
          <div className="flex xsm:flex-col md:flex-row">
            <span
              className={styles.minus}
              onClick={(e) => handleUpdate(e, record, "minus")}
            >
              -
            </span>
            <span className={styles.count}>{item}</span>
            <span
              className={styles.plus}
              onClick={(e) => handleUpdate(e, record, "plus")}
            >
              +
            </span>
          </div>
        );
      },
    },
    {
      title: "Return Reason",
      dataIndex: "reason",
      key: "reason",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.reason - b.reason,
      showSorterTooltip: false,
      render: (item: any, record: any) => {
        return (
          <div className="flex xsm:flex-col md:flex-row">
            <ActivityFilterSelector
              onSelect={(e) => handleUpdate(e, record, "reason")}
              className="md:ml-4 xsm:mt-4 md:mt-0"
              defaultValue={item}
            >
              {REASONS.map((reason, index) => {
                return (
                  <Option
                    key={index}
                    style={{ borderBottom: "1px solid #DBDCE0" }}
                    value={reason}
                  >
                    {reason} {item == reason}
                  </Option>
                );
              })}
            </ActivityFilterSelector>
          </div>
        );
      },
    },
    {
      title: "Attach Photo",
      dataIndex: "photo",
      key: "photo",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.photo - b.photo,
      showSorterTooltip: false,
      render: (item: any, record: any) => {
        return <Avatar record={record} />;
      },
    },
    {
      title: "Additional Information",
      dataIndex: "information",
      key: "information",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.information - b.information,
      showSorterTooltip: false,
      render: (item: any, record: any) => {
        return (
          <SearchInput
            value={item}
            searchIcon={false}
            placeholder={item}
            className="md:ml-4 xsm:mt-4 md:mt-0"
            onChange={(e) => handleUpdate(e, record, "information")}
          />
        );
      },
    },
  ];

  const handleUpdate = (event: any, record: any, action?: string) => {
    let newItem = {
      id: record["_id"],
    } as any;

    if (action == "plus") {
      newItem.return_quantity = +record.return_quantity + 1;
    } else if (action == "minus") {
      newItem.return_quantity = +record.return_quantity - 1;
    } else {
      if (action) {
        newItem[action] = event;
      }
    }

    dispatch(updateReturnItems(newItem));
  };

  return (
    <ReturnPortalContainer>
      <div>
        <div className={styles.titleSection}>
          <p className={styles.title}>Select Your Return</p>
          <p className={styles.subTitle}>
            Please tell us the products you would like to return.
          </p>
        </div>
        <div className={styles.description}>
          <div className={styles.details}>
            <ul>
              <li className="font-bold">
                <span className="font-bold">Customer Information:</span>
              </li>
              <li>John Jones</li>
              <li>Delivery Address: 99 New Road, Birmigham, B109YZ</li>
              <li className={styles.link}>
                <a href="">johnjones@gmail.com</a>
              </li>
              <li className={styles.address}>(44) 076 541 2331</li>
            </ul>
            <ul>
              <li className="font-bold text-right">
                <span className="font-bold">Order Information:</span>
              </li>
              <li className="text-right">Order No: 5123457</li>
              <li className="text-right">Order Date: 01/12/2021</li>
              <li className="text-right">
                <span className={styles.wrong}>Wrong Item sent?</span>
                <Button
                  className="rounded"
                  type="default"
                  style={{
                    borderColor: theme?.primary,
                    height: "40px",
                  }}
                  onClick={() => {
                    setWrongItemSentModalShow(true);
                  }}
                >
                  Click here
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="z-0">
          <UserTable
            columns={usersColumns}
            dataSource={returnProducts}
            loading={false}
          />
        </div>
        <WrongItemSentModal
          products={PRODUCTS}
          show={wrongItemSentModalShow}
          onHide={() => setWrongItemSentModalShow(false)}
        />
      </div>
    </ReturnPortalContainer>
  );
};

export default ItemSelection;
