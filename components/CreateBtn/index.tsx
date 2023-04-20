/** @format */

import { Button } from "antd";
import useTheme from "../../hooks/useTheme";
import styles from "./index.module.css";

interface createBtnProps {
  title: string;
  onClick: () => void;
}

const CreateBtn = ({ title, onClick }: createBtnProps) => {
  const theme = useTheme();
  return (
    <Button
      className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 right-4"
      type="primary"
      style={{ background: theme?.primarySea, borderRadius: "4px" }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default CreateBtn;
