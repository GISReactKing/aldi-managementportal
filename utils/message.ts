import { message } from "antd";

export type MessageType = "success" | "danger" | "warning" | "info";

export const Message = (type: MessageType, text: string, duration?: number) => {
  if (type === "danger") {
    message.error(text, duration ? duration : 5.0);
  } else if (type === "success") {
    message.success(text, duration ? duration : 2.5);
  } else if (type === "warning") {
    message.warn(text, duration ? duration : 2.5);
  }
};
