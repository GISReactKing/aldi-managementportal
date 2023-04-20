import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import Modal from "../CustomModal";
import useTheme from "../../hooks/useTheme";

interface Props {
  showModal?: boolean;
  onCloseModal: () => void;
}

const DatePicker = ({ showModal, onCloseModal }: Props) => {
  const theme = useTheme();
  const defaultFrom = {
    year: 2019,
    month: 4,
    day: 16,
  };
  const defaultTo = {
    year: 2019,
    month: 4,
    day: 19,
  };
  const defaultValue = {
    from: defaultFrom,
    to: defaultTo,
  };

  const [selectedDayRange, setSelectedDayRange] = useState<any>(defaultValue);

  const myCustomLocale = {
    // months list by order
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],

    // week days by order
    weekDays: [
      {
        name: "Sunday", // used for accessibility
        short: "Sun", // displayed at the top of days' rows
        isWeekend: true, // is it a formal weekend or not?
      },
      {
        name: "Monday",
        short: "Mon",
      },
      {
        name: "Tuesday",
        short: "Tue",
      },
      {
        name: "Wednesday",
        short: "Wed",
      },
      {
        name: "Thursday",
        short: "Thu",
      },
      {
        name: "Friday",
        short: "Fri",
      },
      {
        name: "Saturday",
        short: "Sat",
        isWeekend: true,
      },
    ],

    // just play around with this number between 0 and 6
    weekStartingIndex: 0,

    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject: any) {
      return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date: any) {
      return new Date(date.year, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date: any) {
      return new Date(date.year, date.month, 0).getDate();
    },

    // return a transformed digit to your locale
    transformDigit(digit: any) {
      return digit;
    },

    // texts in the date picker
    nextMonth: "Next Month",
    previousMonth: "Previous Month",
    openMonthSelector: "Open Month Selector",
    openYearSelector: "Open Year Selector",
    closeMonthSelector: "Close Month Selector",
    closeYearSelector: "Close Year Selector",
    defaultPlaceholder: "Select...",

    // for input range value
    from: "from",
    to: "to",

    // used for input value when multi dates are selected
    digitSeparator: ",",

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: false,
  };

  return (
    <Modal showModal={showModal} onCloseModal={onCloseModal}>
      <Calendar
        calendarClassName="myCalendar-css"
        locale={myCustomLocale}
        value={selectedDayRange}
        onChange={(e: any) => setSelectedDayRange(e)}
        colorPrimary={theme.primary} // added this
        colorPrimaryLight={theme.lightBlue} // and this
        shouldHighlightWeekends
        renderFooter={(): JSX.Element => {
          return (
            <div className="h-52 flex justify-end items-center p-4">
              <span
                onClick={onCloseModal}
                style={{ marginRight: "1rem", color: theme?.mono }}
                className="text-sm font-medium opacity-70 cursor-pointer"
              >
                Cancel
              </span>
              <span
                style={{ color: theme?.primarySea }}
                className="text-sm font-medium cursor-pointer"
              >
                OK
              </span>
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default DatePicker;
