import DropOffSelector from "../../../../components/Select";
import { PlusIcon, SubtractIcon } from "../../../../components/Icons";
import styles from "./dropoff.module.scss";
import { Select } from "antd";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { useState } from "react";
import useTheme from "../../../../hooks/useTheme";
const { Option } = Select;

interface Props {}

interface SelectInputProps {
  onSearchByStatus?: (e: string) => void;
}

const optionsSelectDropOffShop: any = [
  {
    logo: "/logo.png",
    value: "RoyalMail -Nearest Post Office",
    status: "(Printer Needed)",
  },
  {
    logo: "/logo.png",
    value: "Hermes -Nearest Locker",
    status: "",
  },
  {
    logo: "/logo.png",
    value: "Hermes -Nearest Locker",
    status: "(Printer Needed)",
  },
  {
    logo: "/logo.png",
    value: "Local Aldi -Nearest Aldi Office",
    status: "(Printer Needed)",
  },
];

const optionsSelectDropOffLocation: any = [
  {
    logo: "/logo.png",
    value: "RoyalMail -Nearest Post Office",
    status: "(Printer Needed)",
  },
  {
    logo: "/logo.png",
    value: "Hermes -Nearest Locker",
    status: "",
  },
  {
    logo: "/logo.png",
    value: "Hermes -Nearest Locker",
    status: "(Printer Needed)",
  },
  {
    logo: "/logo.png",
    value: "Local Aldi -Nearest Aldi Office",
    status: "(Printer Needed)",
  },
];

const SelectDropOffShop = ({
  onSearchByStatus,
}: SelectInputProps): JSX.Element => {
  const theme = useTheme();
  return (
    <div className="flex xsm:flex-col md:flex-row">
      <DropOffSelector
        defaultValue={""}
        width="96%"
        onSelect={onSearchByStatus}
        placeholder="Select Carrier"
        className="mt-6 rounded"
      >
        <Option
          className="font-bold"
          style={{ borderBottom: "1px solid #DBDCE0" }}
          value="All"
        >
          Available Carriers
        </Option>
        {optionsSelectDropOffShop.map((items: any, index: number) => {
          const border =
            optionsSelectDropOffShop.length !== index + 1
              ? { borderBottom: "1px solid #DBDCE0" }
              : {};
          return (
            <Option
              key={index}
              style={border}
              label={items?.value}
              value={items?.value}
              className="text-12"
            >
              <div className="flex justify-between">
                <div className="flex">
                  <img
                    alt="Logo image"
                    src={items?.logo}
                    width={"20px"}
                    height={"20px"}
                  />
                  <span className="text-xsm ml-2">{items?.value}</span>
                </div>
                <span
                  style={{ color: theme?.monoPlaceholder }}
                  className="text-12"
                >
                  {items?.status}
                </span>
              </div>
            </Option>
          );
        })}
      </DropOffSelector>
    </div>
  );
};

const SelectDropOffLocation = ({
  onSearchByStatus,
}: SelectInputProps): JSX.Element => {
  const theme = useTheme();

  return (
    <div className="flex xsm:flex-col md:flex-row">
      <DropOffSelector
        defaultValue={""}
        width="96%"
        onSelect={onSearchByStatus}
        placeholder="Select Locations"
        className="mt-2 rounded"
      >
        <Option
          className="font-bold"
          style={{ borderBottom: "1px solid #DBDCE0" }}
          value="All"
        >
          Available Carriers Locations
        </Option>
        {optionsSelectDropOffLocation.map((items: any, index: number) => {
          const border =
            optionsSelectDropOffShop.length !== index + 1
              ? { borderBottom: "1px solid #DBDCE0" }
              : {};
          return (
            <Option
              key={index}
              style={border}
              label={items?.value}
              value={items?.value}
              className="text-12"
            >
              <div className="flex justify-between">
                <div className="flex">
                  <img
                    alt="Logo image"
                    src={items?.logo}
                    width={"20px"}
                    height={"20px"}
                  />
                  <span className="text-xsm ml-2">{items?.value}</span>
                </div>
                <span
                  style={{ color: theme?.monoPlaceholder }}
                  className="text-12"
                >
                  {items?.status}
                </span>
              </div>
            </Option>
          );
        })}
      </DropOffSelector>
    </div>
  );
};

interface ParcelCounterProps {}
const ParcelCounter = ({}: ParcelCounterProps) => {
  const [parcelQty, setParcelQty] = useState<number>(0);
  const theme = useTheme();
  return (
    <div className="mt-6 flex">
      <span
        style={{ color: theme?.monoLabel }}
        className="text-xsm font-medium flex items-center justify-center mr-1"
      >
        How many Parcel labels do you need?
      </span>
      <span className="flex  items-center justify-center">
        <button
          className={styles.counterBtn}
          onClick={() => {
            if (parcelQty === 0) return;
            setParcelQty(parcelQty - 1);
          }}
        >
          {<SubtractIcon />}
        </button>
        <span className={styles.counter}>{parcelQty}</span>
        <button
          className={styles.counterBtn}
          onClick={() => {
            setParcelQty(parcelQty + 1);
          }}
        >
          {<PlusIcon />}
        </button>
      </span>
    </div>
  );
};

const DropOffSelectors = (props: Props) => {
  return (
    <div className="w-full">
      <SelectDropOffShop />
      <SelectDropOffLocation />
      <ParcelCounter />
    </div>
  );
};

export default DropOffSelectors;
