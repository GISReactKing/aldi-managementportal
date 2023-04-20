/** @format */

import { useState } from "react";
import ActivityFilterSelector from "../../../../components/Select";
import SearchInput from "../../../../components/SearchInput";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Modal, Select } from "antd";
import { CloseIcon } from "../../../../components/Icons";
import useTheme from "../../../../hooks/useTheme";

const { Option } = Select;

const RoleType = [
  {
    title: "All",
    value: "All",
  },
  {
    title: "Super Admin",
    value: "Super Admin",
  },
  {
    title: "Admin",
    value: "Admin",
  },
];

interface FilterBarProps {
  onChangeText: (e: string) => void;
  onSearchByRoleType: (e: string) => void;
}

interface SelectInputProps {
  onSearchByRoleType: (e: string) => void;
}

const SelectInput = ({ onSearchByRoleType }: SelectInputProps): JSX.Element => {
  return (
    <div className="flex xsm:flex-col md:flex-row">
      <ActivityFilterSelector
        onSelect={onSearchByRoleType}
        placeholder="Role Type: All"
        className="md:ml-4 xsm:mt-4 md:mt-0"
        width={250}
      >
        {RoleType.map((item: any, i: number) => (
          <Option key={i} value={item.value}>
            {item.title}
          </Option>
        ))}
      </ActivityFilterSelector>
    </div>
  );
};

const FilterBar = ({
  onChangeText,
  onSearchByRoleType,
}: FilterBarProps): JSX.Element => {
  const theme = useTheme();
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div className="z-50 flex justify-between md:items-center">
      <div className="xsm:hidden md:block">
        <SelectInput onSearchByRoleType={(e) => onSearchByRoleType(e)} />
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
        {/* <SelectInput /> */}
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
        placeholder="Search by role name"
        onChange={(e) => onChangeText(e)}
      />
    </div>
  );
};

export default FilterBar;
