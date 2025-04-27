"use client";
import React, { useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { PiCalendarDuotone } from "react-icons/pi";
import { addLocale } from "primereact/api";
import { useEffect } from "react";

import { OverlayPanel } from "primereact/overlaypanel";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

type Props = {
  value: Date | null;
  onFilterChange: (key: string, value: any) => void;
};

const DateFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [date, setDate] = useState<Date>(new Date()); /// here
  const op = useRef<OverlayPanel>(null);
  const formatDate = (date: Date | null): string =>
    date ? date.toLocaleDateString("he-IL") : "תאריך";

  useEffect(() => {
    addLocale("he", {
      firstDayOfWeek: 0, // יום ראשון
      dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
      dayNamesShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"],
      dayNamesMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      monthNames: [
        "ינואר",
        "פברואר",
        "מרץ",
        "אפריל",
        "מאי",
        "יוני",
        "יולי",
        "אוגוסט",
        "ספטמבר",
        "אוקטובר",
        "נובמבר",
        "דצמבר",
      ],
      monthNamesShort: [
        "ינו",
        "פבר",
        "מרץ",
        "אפר",
        "מאי",
        "יונ",
        "יול",
        "אוג",
        "ספט",
        "אוק",
        "נוב",
        "דצמ",
      ],
      today: "היום",
      clear: "נקה",
    });
  }, []);

  const dateHandler = (date: Date) => {
    setDate(date);
    onFilterChange("date", date);
  };
  return (
    <div className="relative">
      <div
        className="flex cursor-pointer items-center gap-2 rounded-4xl border border-gray-300 pt-1 pr-3 pb-1 pl-3"
        onClick={(e) => op.current?.toggle(e)}
      >
        <PiCalendarDuotone />
        <span>{formatDate(date)}</span>
      </div>

      <OverlayPanel ref={op} dismissable className="z-20">
        <Calendar
          locale="he"
          value={date}
          onChange={(e) => dateHandler(e.value as Date)}
          inline
          showIcon={false}
        />
      </OverlayPanel>
    </div>
  );
};

export default DateFilter;
