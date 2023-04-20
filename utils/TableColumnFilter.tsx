import React, { useState, useRef } from "react";
import { Button, Input, Space, DatePicker } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

export const handleSearch = (
  selectedKeys: any,
  confirm: any,
  dataIndex: any,
  setSearchText: any,
  setSearchedColumn: any
) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

export const handleReset = (clearFilters: any, setSearchText: any) => {
  clearFilters();
  setSearchText("");
};
export const getColumnSearchProps = (
  dataIndex: any,
  searchInputRef: any,
  { searchText, setSearchText }: any,
  { searchedColumn, setSearchedColumn }: any,
  subDataIndex?: string
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: any) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInputRef}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex,
              setSearchText,
              setSearchedColumn
            )
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters, setSearchText)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: any) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value: string, record: any) =>
    subDataIndex && record[dataIndex] && record[dataIndex][subDataIndex]
      ? record[dataIndex][subDataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      : record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "",
  onFilterDropdownVisibleChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => searchInputRef?.current?.select(), 100);
    }
  },
  render: (text: string) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});

export const getColumnDropSearchProps = (
  dataIndex: any,
  searchInputRef: any,
  { searchText, setSearchText }: any,
  { searchedColumn, setSearchedColumn }: any,
  filters: any[]
) => ({
  filters,
  filterSearch: true,
  onFilter: (value: string, record: any) => record[dataIndex].startsWith(value),
  render: (text: string) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text : ""}
      />
    ) : (
      text
    ),
});

export const getColumnDateSearchProps = (
  dataIndex: any,
  searchInputRef: any,
  { searchText, setSearchText }: any,
  { searchedColumn, setSearchedColumn }: any,
  subDataIndex?: string,
  isTypeNotDate?: boolean
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: any) => (
    <div style={{ padding: 8 }}>
      <DatePicker
        // format={"DD-MM-YY"}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        format={"DD/MM/YYYY"}
        onChange={(e) => {
          setSelectedKeys([e]);
        }}
        allowClear={true}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex,
              setSearchText,
              setSearchedColumn
            )
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters, setSearchText)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
        >
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: any) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value: any, record: any) => {
    return value &&
      dataIndex &&
      record &&
      Object.keys(record)?.length &&
      record[dataIndex]
      ? moment(record[dataIndex]).format("DD-MM-YYYY") ===
          value.format("DD-MM-YYYY")
      : "";
  },
  render: (text: string) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? moment(text).format("DD/MM/YYYY") : ""}
      />
    ) : (
      moment(text).format("DD/MM/YYYY")
    ),
});
