/** @format */

import { useState } from "react";
import { Input, Select } from "antd";
import useTheme from "../../hooks/useTheme";

interface Props {
  className?: string;
  placeholder: string;
  searchIcon: boolean;
  value: string;
  onChange: (e: string) => void;
}
interface SearchIconProps {
  color?: string;
}

const SearchIcon = ({ color }: SearchIconProps): JSX.Element => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875Z"
        fill={color}
      />
    </svg>
  );
};

const SearchInput = ({
  value,
  placeholder,
  searchIcon,
  className,
  onChange,
}: Props): JSX.Element => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <>
      <Input
        className={className + "xsm:w-52 md:w-72"}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={{
          height: 44,
          borderRadius: 8,
          borderColor: theme?.monoInput,
          color: theme?.mono,
          backgroundColor: theme?.offWhite,
        }}
        type="text"
        placeholder={placeholder}
        value={value}
        suffix={
          searchIcon ? (
            <SearchIcon
              color={isActive ? theme?.primary : theme?.monoPlaceholder}
            />
          ) : (
            ""
          )
        }
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default SearchInput;
