import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import classNames from "classnames";
import React from "react";
import useTheme from "../../hooks/useTheme";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type AppButtonProps = {
  title?: string;
  className?: string;
  onClick?: (e?: any) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: any;
  loading?: boolean;
  datatestId?: string;
  type?: "contained" | "outlined";
};

export const AppButton: React.FC<AppButtonProps> = ({
  title = "",
  onClick,
  style,
  className = "",
  disabled = false,
  children = "",
  loading = false,
  datatestId,
  type = "contained",
}) => {
  const theme = useTheme();
  const btnStyle =
    type === "contained"
      ? {
          ...(!disabled
            ? { background: theme?.primaryNight }
            : { background: theme?.disabledGray, cursor: "not-allowed" }),
          color: disabled ? theme?.monoGray : theme?.white,
          ...style,
          top: "18px",
        }
      : {
          ...(!disabled
            ? {
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: theme?.orange,
                color: theme?.orange,
              }
            : {
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: theme?.disabledGray,
              }),
          color: disabled ? theme?.monoGray : theme?.orange,
          ...style,
          top: "18px",
          background: theme?.white,
        };
  return (
    <button
      className={classNames(
        `lg:h-8 font-bold mx-2 rounded text-center !mt-96
        `,
        className
      )}
      style={btnStyle}
      onClick={onClick}
      disabled={disabled}
      data-testId={datatestId}
    >
      {loading ? (
        <Spin style={{ color: theme?.btnLoaderColor }} indicator={antIcon} />
      ) : (
        title
      )}
      {/* {loading ? (
        <Spin indicator={antIcon} style={{ marginRight: 10 }} />
      ) : null}
      {title} */}
    </button>
  );
};
