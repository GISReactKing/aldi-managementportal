/** @format */

import { useState } from "react";
import ActivityFilterSelector from "../../../../components/Select";
import SearchInput from "../../../../components/SearchInput";
import { FilterOutlined } from "@ant-design/icons";
import { CloseIcon } from "../../../../components/Icons";
import {
  Input,
  Divider,
  Select,
  Pagination,
  Tag,
  Button,
  Table,
  Space,
  Typography,
  DatePicker,
} from "antd";
import { AppButton } from "../../../../components/AppButton";
import moment from "moment";
import { Message } from "../../../../utils/message";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterBarProps {
  customDateHandle: (v: any) => void;
  setShowData: (v: any) => void;
}

interface SelectInputProps {
  onChange?: (v: any) => void;
}

const SelectInput = ({ onChange }: SelectInputProps): JSX.Element => {
  return (
    <div className="flex xsm:flex-col md:flex-row">
      <ActivityFilterSelector onChange={onChange} placeholder="Date: Users">
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="All">
          All
        </Option>
        <Option
          style={{ borderBottom: "1px solid #DBDCE0" }}
          value="Last 7 Days"
        >
          Last 7 Days
        </Option>
        <Option
          style={{ borderBottom: "1px solid #DBDCE0" }}
          value="Last 30 Days"
        >
          Last 30 Days
        </Option>
        <Option value="Custom Date">Custom Date</Option>
      </ActivityFilterSelector>

      <ActivityFilterSelector
        placeholder="Position: All"
        className="md:ml-4 xsm:mt-4 md:mt-0"
      >
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="All">
          All
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="Example 1">
          Example 1
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="Example 2">
          Example 2
        </Option>
        <Option value="Example 3">Example 3</Option>
      </ActivityFilterSelector>

      <ActivityFilterSelector
        placeholder="Status: All"
        className="md:ml-4 xsm:mt-4 md:mt-0"
      >
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="All">
          All
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="Example 1">
          Example 1
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="Example 2">
          Example 2
        </Option>
        <Option value="Example 3">Example 3</Option>
      </ActivityFilterSelector>

      <ActivityFilterSelector
        width={201}
        placeholder="Authorization: All"
        className="md:ml-4 xsm:mt-4 md:mt-0"
      >
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="All">
          All
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="Example 1">
          Example 1
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="Example 2">
          Example 2
        </Option>
        <Option value="Example 3">Example 3</Option>
      </ActivityFilterSelector>
    </div>
  );
};

const FilterBar = ({
  customDateHandle,
  setShowData,
}: FilterBarProps): JSX.Element => {
  const [filterDates, setFilterDates] = useState<any>([]);
  const [filterDateStrings, setFilterDateStrings] = useState({
    from: "",
    to: "",
  }) as any;

  const handleRangeDatePicker = (dates: any, dateStrings: any) => {
    if (dateStrings.length > 1) {
      let from = "";
      if (dateStrings[0]) {
        const fromDateArray = dateStrings[0].split("/");
        fromDateArray.reverse();
        from = fromDateArray.join("-");
      }

      let to = "";
      if (dateStrings[1]) {
        const toDateArray = dateStrings[1].split("/");
        toDateArray.reverse();
        to = toDateArray.join("-");
      }

      // dispatch(filterInvoiceSummary({ page, limit, sort: "created", desc: false, search: searchString, from, to, username: currentUser?.username }));
      setFilterDateStrings({ from, to });
      setFilterDates(dates);
    } else {
      // setShowData(false);
    }
  };

  return (
    // <div className='z-50 flex justify-between md:items-center'>
    //   <div className='xsm:hidden md:block'>
    //     <SelectInput onChange={customDateHandle}/>
    //   </div>
    //   <Modal
    //     onOk={() => setVisible(false)}
    //     onCancel={() => setVisible(false)}
    //     closeIcon={
    //       <span className='absolute top-4 right-4'>
    //         <CloseIcon size={24} color={theme?.mono} />
    //       </span>
    //     }
    //     title='Filter User From Data'
    //     centered
    //     visible={visible}
    //     okText='Filter'
    //     okButtonProps={{
    //       className: 'bg-primary-sea border-0',
    //     }}>
    //     <SelectInput />
    //   </Modal>
    //   <Button
    //     onClick={() => setVisible(true)}
    //     className='flex items-center text-mono md:hidden'
    //     style={{ height: 44 }}
    //     type='dashed'
    //     icon={<FilterOutlined />}>
    //     Filter
    //   </Button>

    //   <SearchInput value={''} searchIcon={true} placeholder='Search by username' className='' onChange={(e) => console.log(e)}  />
    // </div>
    <div className="d-flex flex-direction-row align-items-end mb-2">
      <div className="filter d-flex justify-content-between">
        <label className="dateFilter">
          <Space direction="vertical">
            <span className="mr-3">Select Date From / To:</span>
            <RangePicker
              format={"DD/MM/YYYY"}
              value={filterDates}
              disabledDate={(current) => {
                let customDate = moment().add(0, "days");
                return current && current >= moment(customDate, "DD/MM/YYYY");
              }}
              dateRender={(current) => {
                return (
                  <div className="ant-picker-cell-inner">{current.date()}</div>
                );
              }}
              onChange={(dates, dateStrings) => {
                setFilterDates(dates);
                handleRangeDatePicker(dates, dateStrings);
              }}
            />
          </Space>
        </label>
      </div>
      <AppButton
        title="Display"
        className="px-4"
        onClick={() => customDateHandle(filterDateStrings)}
        disabled={!filterDates?.[1]}
      />
    </div>
  );
};

export default FilterBar;
