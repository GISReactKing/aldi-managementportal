import { default as React } from "react";
import { Row, Col } from "react-bootstrap";
import { Select } from "antd";
import styles from "./carrier-parcel-limits.module.scss";
import ActivityFilterSelector from "../../../components/Select";
import SearchInput from "../../../components/SearchInput";

const { Option } = Select;

interface SelectInputProps {
  options: any;
  onSelectChanged: (e: string) => void;
}

const SelectInput = ({
  onSelectChanged,
  options,
}: SelectInputProps): JSX.Element => {
  return (
    <div className="flex xsm:flex-col md:flex-row">
      <ActivityFilterSelector
        defaultValue={""}
        onSelect={onSelectChanged}
        placeholder={`${options.title}: All`}
      >
        <Option style={{ borderBottom: "1px solid #DBDCE0" }} value="All">
          All
        </Option>
        {options.data.map((item: string, index: number) => {
          return (
            <Option
              key={index}
              style={{ borderBottom: "1px solid #DBDCE0" }}
              value={item}
            >
              {item}
            </Option>
          );
        })}
      </ActivityFilterSelector>
    </div>
  );
};

interface FilterBarProps {
  onChangeText: (e: string) => void;
  onSelectChanged: (e: string) => void;
}

const FilterBar = ({ onChangeText, onSelectChanged }: FilterBarProps) => {
  const sample = ["Uk Mail", "Yodel", "Hermes"];

  return (
    <Row className={`${styles.fieldsRow} ${styles.customFormRow} mb-4`}>
      <Col md={"9"}>
        <Row>
          <Col className="pr-0">
            <SelectInput
              onSelectChanged={(e) => onSelectChanged(e)}
              options={{ title: "Carrier", data: sample }}
            />
          </Col>
          <Col className="pr-0">
            <SelectInput
              onSelectChanged={(e) => onSelectChanged(e)}
              options={{ title: "Status", data: sample }}
            />
          </Col>
          <Col className="pr-0">
            <SelectInput
              onSelectChanged={(e) => onSelectChanged(e)}
              options={{ title: "Dispatch Method", data: sample }}
            />
          </Col>
          <Col className="pr-0">
            <SelectInput
              onSelectChanged={(e) => onSelectChanged(e)}
              options={{ title: "Dispatch Service", data: sample }}
            />
          </Col>
        </Row>
      </Col>
      <Col md={"3"}>
        <SearchInput
          value={""}
          searchIcon={true}
          placeholder="Search by carriers"
          className="md:ml-4 xsm:mt-4 md:mt-0"
          onChange={(e) => onChangeText(e)}
        />
      </Col>
    </Row>
  );
};

export default FilterBar;
