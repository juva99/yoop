"use client";
import React, { useState, useRef } from "react";
import { PiCalendarDuotone } from "react-icons/pi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { he } from "date-fns/locale";

type Props = {
  value: Date | null;
  onFilterChange: (key: string, value: any) => void;
};

const DateFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [date, setDate] = useState<Date>(new Date());

  const formatDate = (date: Date | null): string =>
    date ? format(date, "PPP", { locale: he }) : "תאריך";

  const dateHandler = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      onFilterChange("date", date);
    }
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex cursor-pointer items-center gap-2 rounded-4xl border border-gray-300 pt-1 pr-3 pb-1 pl-3">
            <PiCalendarDuotone />
            <span>{formatDate(date)}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="z-20 w-auto p-0"
          align="start"
          sideOffset={5}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={dateHandler}
            locale={he}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
