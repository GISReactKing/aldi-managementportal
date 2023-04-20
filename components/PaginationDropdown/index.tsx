import { Select } from "antd";
import ActivityFilterSelector from "../../components/Select";

const { Option } = Select;

interface PaginationDropdownProps {
  onPagination: (e: number) => void;
  count: any;
  value?: any;
}

const PaginationDropdown = ({
  onPagination,
  count,
  value,
}: PaginationDropdownProps): JSX.Element => {
  return (
    <ActivityFilterSelector
      value={value}
      width={90}
      onSelect={(e) => onPagination(Number(e))}
      className="md:ml-2 xsm:mt-4 md:mt-0 md:mb-2"
    >
      {count && count.length
        ? count.map((item: any, index: any) => (
            <Option
              key={index}
              style={{
                borderBottom: `${
                  count.length === index + 1 ? "0" : "1"
                }px solid #DBDCE0`,
              }}
              value={item}
            >
              {item}
            </Option>
          ))
        : null}
    </ActivityFilterSelector>
  );
};

export default PaginationDropdown;
