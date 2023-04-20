/** @format */
import SearchInput from "../../../../components/SearchInput";

interface FilterBarProps {
  onChangeText: (e: string) => void;
}

const FilterBar = ({ onChangeText }: FilterBarProps): JSX.Element => {
  return (
    <div className="z-50 flex justify-between md:items-center">
      <div className="xsm:hidden md:flex">
        <SearchInput
          value={""}
          searchIcon={true}
          placeholder="Search SKU"
          className="md:ml-4 xsm:mt-4 md:mt-0"
          onChange={(e) => onChangeText(e)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
