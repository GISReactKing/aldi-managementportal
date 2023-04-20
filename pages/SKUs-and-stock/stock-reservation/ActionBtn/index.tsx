/** @format */

import { Popover, Button } from "antd";
import { useState } from "react";

interface actionBtnWrapperProps {
  children?: any;
  visible?: boolean;
  setVisible?: (value: boolean) => void;
}

interface actionBtnProps {
  onHandleModal: () => void;
}

interface iconProps {}

const Icon = ({}: iconProps) => {
  return (
    <svg
      width="4"
      height="16"
      viewBox="0 0 4 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
        fill="#999999"
      />
    </svg>
  );
};

const ActionBtnWrapper = ({
  children,
  visible,
  setVisible,
}: actionBtnWrapperProps) => {
  return (
    <Popover
      onVisibleChange={(v) => (setVisible ? setVisible(v) : console.log(v))}
      visible={visible}
      placement="bottomRight"
      arrowPointAtCenter
      content={children}
      trigger="click"
    >
      <Button
        onClick={() => (setVisible ? setVisible(true) : console.log(true))}
        className="items-center flex justify-end w-auto h-auto py-0 border-0"
        icon={<Icon />}
      />
    </Popover>
  );
};

const ActionBtn = ({ onHandleModal }: actionBtnProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const onOpenModal = () => {
    onHandleModal();
    setVisible(false);
  };

  return (
    <ActionBtnWrapper
      visible={visible}
      setVisible={(e) => setVisible(e ? true : false)}
    >
      <Button
        onClick={onOpenModal}
        className="p-0 py-2 h-100 text-12 tracking-xl-wide hover:bg-white text-secondary-fire hover:text-red-700"
        type="text"
      >
        Ammend Stock
      </Button>
    </ActionBtnWrapper>
  );
};

export default ActionBtn;
