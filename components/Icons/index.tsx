/** @format */

export const CloseIcon = ({
  color = "#FCFCFC",
  size = 32,
}: {
  color?: string;
  size?: string | number;
}): JSX.Element => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 32 32`}
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" fill="white" fillOpacity="0.01" />
      <path
        d="M16.0001 14.1148L8.94272 7.05744C8.69125 6.81456 8.35445 6.68017 8.00485 6.68321C7.65526 6.68625 7.32084 6.82647 7.07363 7.07368C6.82642 7.32089 6.68619 7.65531 6.68316 8.00491C6.68012 8.3545 6.81451 8.69131 7.05739 8.94277L14.1147 16.0001L7.05739 23.0574C6.81451 23.3089 6.68012 23.6457 6.68316 23.9953C6.68619 24.3449 6.82642 24.6793 7.07363 24.9265C7.32084 25.1737 7.65526 25.314 8.00485 25.317C8.35445 25.32 8.69125 25.1857 8.94272 24.9428L16.0001 17.8854L23.0574 24.9428C23.3089 25.1857 23.6457 25.32 23.9953 25.317C24.3449 25.314 24.6793 25.1737 24.9265 24.9265C25.1737 24.6793 25.3139 24.3449 25.317 23.9953C25.32 23.6457 25.1856 23.3089 24.9427 23.0574L17.8854 16.0001L24.9427 8.94277C25.0701 8.81978 25.1716 8.67265 25.2415 8.50998C25.3114 8.34731 25.3482 8.17235 25.3497 7.99531C25.3513 7.81827 25.3175 7.6427 25.2505 7.47884C25.1834 7.31497 25.0844 7.1661 24.9592 7.04091C24.8341 6.91572 24.6852 6.81672 24.5213 6.74968C24.3575 6.68264 24.1819 6.6489 24.0049 6.65044C23.8278 6.65198 23.6529 6.68876 23.4902 6.75864C23.3275 6.82852 23.1804 6.93009 23.0574 7.05744L16.0001 14.1148Z"
        fill={color}
      />
    </svg>
  );
};

export const DeleteIconInModal = (): JSX.Element => {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M73.6613 84.888C55.216 84.888 42.5493 94.4427 33.6613 94.4427C24.7733 94.4427 6.10663 89.3334 6.10663 48.4454C6.10663 7.55735 31.2186 1.55469 40.9946 1.55469C86.7733 1.55469 106.328 84.888 73.6613 84.888Z"
        fill="#FFECEC"
      />
      <path
        d="M47.3333 40.6667H27.3333C25.8613 40.6667 24.6666 39.472 24.6666 38V30.6667C24.6666 23.672 30.3386 18 37.3333 18C44.328 18 50 23.672 50 30.6667V38C50 39.472 48.8053 40.6667 47.3333 40.6667Z"
        fill="#F0ECFF"
      />
      <path
        d="M44.6667 34C44.6667 37.688 41.392 40.6667 37.3333 40.6667C33.2747 40.6667 30 37.688 30 34C32 34 37.3333 29.3333 37.3333 26C37.3333 29.3333 42.6667 34 44.6667 34Z"
        fill="#D70000"
      />
      <path
        d="M47.3335 42.6667H27.3335C24.7602 42.6667 22.6669 40.5733 22.6669 38V30.6667C22.6669 22.5787 29.2455 16 37.3335 16C45.4215 16 52.0002 22.5787 52.0002 30.6667V38C52.0002 40.5733 49.9069 42.6667 47.3335 42.6667ZM37.3335 20C31.4509 20 26.6669 24.784 26.6669 30.6667V38C26.6669 38.368 26.9655 38.6667 27.3335 38.6667H47.3335C47.7015 38.6667 48.0002 38.368 48.0002 38V30.6667C48.0002 24.784 43.2162 20 37.3335 20Z"
        fill="#D70000"
      />
      <path
        d="M37.3333 42.6667C32.1866 42.6667 27.9999 38.7787 27.9999 34C27.9999 32.896 28.8959 32 29.9999 32C31.2266 31.7973 35.3333 28.08 35.3333 26C35.3333 24.896 36.2293 24 37.3333 24C38.4373 24 39.3333 24.896 39.3333 26C39.3333 28.08 43.4399 31.7973 44.7306 32.0027C45.8346 32.0027 46.6666 32.8933 46.6666 34C46.6666 38.7787 42.4799 42.6667 37.3333 42.6667ZM32.2293 35.3547C32.8933 37.2693 34.9306 38.6667 37.3333 38.6667C39.7359 38.6667 41.7733 37.2693 42.4373 35.3547C40.7119 34.4933 38.7546 32.8533 37.3333 30.9573C35.9119 32.8533 33.9546 34.4933 32.2293 35.3547Z"
        fill="#D70000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0001 69.3333H40.0001V67.3333H56.6667V58C56.6667 53.5813 53.0853 50 48.6667 50H42.7201V48H26.0001C20.4855 48 16.0001 52.4853 16.0001 58V67.3333C16.0001 68.4373 16.8961 69.3333 18.0001 69.3333Z"
        fill="#D70000"
      />
      <path
        d="M62.6668 77.9997C71.1352 77.9997 78.0002 71.1347 78.0002 62.6663C78.0002 54.198 71.1352 47.333 62.6668 47.333C54.1985 47.333 47.3335 54.198 47.3335 62.6663C47.3335 71.1347 54.1985 77.9997 62.6668 77.9997Z"
        fill="#F89797"
      />
      <path
        d="M62.6666 79.9997C53.1093 79.9997 45.3333 72.2237 45.3333 62.6663C45.3333 53.109 53.1093 45.333 62.6666 45.333C72.2239 45.333 79.9999 53.109 79.9999 62.6663C79.9999 72.2237 72.2239 79.9997 62.6666 79.9997ZM62.6666 49.333C55.3146 49.333 49.3333 55.3143 49.3333 62.6663C49.3333 70.0183 55.3146 75.9997 62.6666 75.9997C70.0186 75.9997 75.9999 70.0183 75.9999 62.6663C75.9999 55.3143 70.0186 49.333 62.6666 49.333Z"
        fill="#353535"
      />
      <path
        d="M50.3873 72.1045L72.0894 50.4024L74.9174 53.2304L53.2153 74.9325L50.3873 72.1045Z"
        fill="#353535"
      />
    </svg>
  );
};

export const EmailConfirmationIcon = (): JSX.Element => {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="48" cy="48" r="48" fill="#E7F8FF" />
      <path
        d="M64 37.3337H61.3334V32.0003C61.3334 24.6403 55.36 18.667 48 18.667C40.64 18.667 34.6667 24.6403 34.6667 32.0003V37.3337H32C29.0667 37.3337 26.6667 39.7337 26.6667 42.667V69.3337C26.6667 72.267 29.0667 74.667 32 74.667H64C66.9334 74.667 69.3334 72.267 69.3334 69.3337V42.667C69.3334 39.7337 66.9334 37.3337 64 37.3337ZM48 61.3337C45.0667 61.3337 42.6667 58.9337 42.6667 56.0003C42.6667 53.067 45.0667 50.667 48 50.667C50.9334 50.667 53.3334 53.067 53.3334 56.0003C53.3334 58.9337 50.9334 61.3337 48 61.3337ZM56.2667 37.3337H39.7334V32.0003C39.7334 27.4403 43.44 23.7337 48 23.7337C52.56 23.7337 56.2667 27.4403 56.2667 32.0003V37.3337Z"
        fill="#5BC5F1"
      />
      <path
        d="M47.9998 69C41.3834 69 36 63.6166 36 57.0002C36 50.3834 41.3834 45 47.9998 45C54.6166 45 60 50.3834 60 57.0002C60 63.617 54.617 69 47.9998 69Z"
        fill="#37A2CE"
      />
      <path
        d="M47.9999 59.1697C47.2203 59.1697 46.5878 58.5371 46.5878 57.7575C46.5878 56.9775 47.2203 56.3454 47.9999 56.3454C48.8895 56.3454 49.6132 55.6217 49.6132 54.7321C49.6132 53.8429 48.8895 53.1192 47.9999 53.1192C47.1107 53.1192 46.387 53.8429 46.387 54.7321C46.387 55.5121 45.7549 56.1442 44.9749 56.1442C44.1953 56.1442 43.5627 55.5121 43.5627 54.7321C43.5627 52.2855 45.5533 50.2949 47.9999 50.2949C50.4469 50.2949 52.4375 52.2855 52.4375 54.7321C52.4375 57.1787 50.4469 59.1697 47.9999 59.1697Z"
        fill="#4CC3F4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M47.9997 60.8828C48.7793 60.8828 49.4119 61.5157 49.4119 62.2949C49.4119 63.0738 48.7793 63.7071 47.9997 63.7071C47.2205 63.7071 46.5876 63.0738 46.5876 62.2949C46.5876 61.5157 47.2205 60.8828 47.9997 60.8828Z"
        fill="#4CC3F4"
      />
    </svg>
  );
};

export const DeleteIcon = (): JSX.Element => {
  return (
    <svg
      className="d-inline"
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z"
        fill="#D70000"
      />
    </svg>
  );
};

export const ExportIcon = (): JSX.Element => {
  return (
    <svg
      className="d-inline"
      width="14"
      height="17"
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 13H10V7H14L7 0L0 7H4V13ZM0 15H14V17H0V15Z" fill="#999999" />
    </svg>
  );
};

export const SmallRestPasswordIcon = (): JSX.Element => {
  return (
    <svg
      className="d-inline"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 12.2L15.4 13.9L14.6 15.2L11 13V8H12.5V12.2ZM20 12C20 16.41 16.41 20 12 20C9.98 20 8.14 19.24 6.73 18H2C0.85 18 0 17.15 0 16V7C0 5.88 0.89 5.04 2 5V4.5C2 2.01 4.01 0 6.5 0C8.84 0 10.74 1.79 10.96 4.08C11.3 4.03 11.65 4 12 4C16.41 4 20 7.59 20 12ZM4 5H9V4.26C8.88 2.99 7.8 2 6.5 2C5.12 2 4 3.12 4 4.5V5ZM18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12Z"
        fill="#5BC5F1"
      />
    </svg>
  );
};
export const CircleCloseIcon = ({ size }: { size: number }): JSX.Element => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="52" rx="26" fill="#ECECEC" />
      <rect
        width="32"
        height="32"
        transform="translate(10 10)"
        fill="white"
        fillOpacity="0.01"
      />
      <path
        d="M26.0005 24.1148L18.9432 17.0574C18.6917 16.8146 18.3549 16.6802 18.0053 16.6832C17.6557 16.6862 17.3213 16.8265 17.0741 17.0737C16.8269 17.3209 16.6867 17.6553 16.6836 18.0049C16.6806 18.3545 16.815 18.6913 17.0579 18.9428L24.1152 26.0001L17.0579 33.0574C16.815 33.3089 16.6806 33.6457 16.6836 33.9953C16.6867 34.3449 16.8269 34.6793 17.0741 34.9265C17.3213 35.1737 17.6557 35.314 18.0053 35.317C18.3549 35.32 18.6917 35.1857 18.9432 34.9428L26.0005 27.8854L33.0579 34.9428C33.3093 35.1857 33.6461 35.32 33.9957 35.317C34.3453 35.314 34.6798 35.1737 34.927 34.9265C35.1742 34.6793 35.3144 34.3449 35.3174 33.9953C35.3205 33.6457 35.1861 33.3089 34.9432 33.0574L27.8859 26.0001L34.9432 18.9428C35.0706 18.8198 35.1721 18.6727 35.242 18.51C35.3119 18.3473 35.3487 18.1723 35.3502 17.9953C35.3517 17.8183 35.318 17.6427 35.251 17.4788C35.1839 17.315 35.0849 17.1661 34.9597 17.0409C34.8345 16.9157 34.6857 16.8167 34.5218 16.7497C34.358 16.6826 34.1824 16.6489 34.0053 16.6504C33.8283 16.652 33.6533 16.6888 33.4907 16.7586C33.328 16.8285 33.1809 16.9301 33.0579 17.0574L26.0005 24.1148Z"
        fill="#42526E"
      />
    </svg>
  );
};

export const SubtractIcon = ({ size }: { size?: number }): JSX.Element => {
  return (
    <svg
      width="12"
      height="2"
      viewBox="0 0 12 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8337 1.83333H0.166992V0.166664H11.8337V1.83333Z"
        fill="#999999"
      />
    </svg>
  );
};

export const PlusIcon = ({ size }: { size?: number }): JSX.Element => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8337 6.83333H6.83366V11.8333H5.16699V6.83333H0.166992V5.16666H5.16699V0.166664H6.83366V5.16666H11.8337V6.83333Z"
        fill="#999999"
      />
    </svg>
  );
};
export const CalenderIcon = ({ size }: { size?: number }): JSX.Element => {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L4 9V11L6 11V9ZM10 9H8V11H10V9ZM14 9H12V11H14V9ZM16 2L15 2V0L13 0V2L5 2V0L3 0L3 2L2 2C0.89 2 0.00999999 2.9 0.00999999 4L0 18C0 19.1 0.89 20 2 20L16 20C17.1 20 18 19.1 18 18L18 4C18 2.9 17.1 2 16 2ZM16 18L2 18L2 7L16 7L16 18Z"
        fill="#999999"
      />
    </svg>
  );
};
