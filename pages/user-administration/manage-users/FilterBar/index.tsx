/** @format */

import { useState } from "react";
import ActivityFilterSelector from "../../../../components/Select";
import SearchInput from "../../../../components/SearchInput";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Modal, Select } from "antd";
import { CloseIcon } from "../../../../components/Icons";
import useTheme from "../../../../hooks/useTheme";

const { Option } = Select;

interface FilterBarProps {
  onChangeText: (e: string) => void;
  onSearchByStatus: (e: string) => void;
}

interface SelectInputProps {
  onSearchByStatus: (e: string) => void;
}

const SelectInput = ({ onSearchByStatus }: SelectInputProps): JSX.Element => {
  return (
    <div className="flex xsm:flex-col md:flex-row">
      <ActivityFilterSelector
        onSelect={onSearchByStatus}
        placeholder="Status: All"
        className="md:ml-4 xsm:mt-4 md:mt-0"
      >
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="All">
          All
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="locked">
          Locked
        </Option>
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="unlocked">
          Unlocked
        </Option>
      </ActivityFilterSelector>
    </div>
  );
};

const FilterBar = ({
  onChangeText,
  onSearchByStatus,
}: FilterBarProps): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);
  const theme = useTheme();
  return (
    <div className="z-50 flex justify-between md:items-center">
      <div className="xsm:hidden md:flex">
        <SearchInput
          value={""}
          searchIcon={true}
          placeholder="Search by site"
          className="md:ml-4 xsm:mt-4 md:mt-0"
          onChange={(e) => console.log(e)}
        />
        <SelectInput onSearchByStatus={onSearchByStatus} />
        <SearchInput
          value={""}
          searchIcon={true}
          placeholder="Search by position"
          className="md:ml-4 xsm:mt-4 md:mt-0"
          onChange={(e) => console.log(e)}
        />
      </div>
      <Modal
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closeIcon={
          <span className="absolute top-4 right-4">
            <CloseIcon size={24} color={theme?.mono} />
          </span>
        }
        title="Filter User From Data"
        centered
        visible={visible}
        okText="Filter"
        okButtonProps={{
          style: { backgroundColor: theme?.primaryNight },
          className: "border-0",
        }}
      >
        <SelectInput onSearchByStatus={(e) => console.log(e)} />
      </Modal>
      <Button
        onClick={() => setVisible(true)}
        className="flex items-center md:hidden"
        style={{ height: 44, color: theme?.mono }}
        type="dashed"
        icon={<FilterOutlined />}
      >
        Filter
      </Button>

      <SearchInput
        value={""}
        searchIcon={true}
        placeholder="Search by username"
        className=""
        onChange={(e) => onChangeText(e)}
      />
    </div>
  );
};

export default FilterBar;
