/** @format */

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "antd";
import useTheme from "../../hooks/useTheme";
import { AppButton } from "../AppButton";

interface Props {
  children?: any;
  icon?: any;
  showModal?: boolean;
  loading?: boolean;
  onCloseModal: (v: boolean) => void;
  primaryBtnColor?: string;
  primaryBtnTitle?: string;
  onPrimaryHandle?: () => void;
}
export default function AppModal({
  primaryBtnTitle = "OK",
  children,
  icon,
  showModal,
  loading = false,
  onCloseModal,
  primaryBtnColor,
  onPrimaryHandle,
}: Props) {
  const theme = useTheme();
  const pBtnColor = primaryBtnColor || theme?.secondaryFire;
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto flex justify-center items-center md:p-6 md:p-4"
        initialFocus={cancelButtonRef}
        onClose={() => onCloseModal(false)}
      >
        <div className="flex items-center justify-center min-h-full w-full">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-25"
            leave="ease-in duration-200"
            leaveFrom="opacity-25"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              style={{ backgroundColor: "#091E42", opacity: 0.25 }}
              className="fixed inset-0 transition-opacity z-50 md:p-6 xsm:p-4"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              style={{
                width: "auto",
                height: "auto",
                backgroundColor: theme?.white,
              }}
              className="z-50 md:p-6 xsm:p-4 flex  flex-col inline-block align-center rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
            >
              {icon && (
                <div className="w-full flex justify-center mt-1 mb-2">
                  {icon}
                </div>
              )}

              {children}

              <div className="self-end w-full flex justify-end">
                <AppButton
                  style={{
                    width: 98,
                    height: 44,
                    color: "black",
                    borderColor: "black",
                  }}
                  className="rounded mr-4"
                  onClick={() => onCloseModal(false)}
                  loading={loading}
                  disabled={loading}
                  title="Cancel"
                  type="outlined"
                />
                <Button
                  style={{
                    width: 98,
                    height: 44,
                    backgroundColor: pBtnColor,
                    color: theme?.white,
                  }}
                  className="border-0 rounded"
                  onClick={onPrimaryHandle}
                  loading={loading}
                  disabled={loading}
                >
                  {primaryBtnTitle}
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
