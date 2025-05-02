"use client";
import React, { useState, useEffect } from "react";
import { PiCalendarDuotone } from "react-icons/pi";
import TimeSlider from "./TimeSlider";
import RadiusSlider from "./RadiusSlider";
import DateFilter from "./DateFilter";
import TypeFilter from "./TypeFilter";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import MapView from "../MapView";
import { Button } from "../ui/button";

type Props = {
  updateFilters: (filters: Filters) => void;
};

type Filters = {
  gameType?: any;
  date?: any;
  startDate?: Date,
  endDate?: Date,
  time?: any;
  location?: any;
  radius?: any;
};

const SearchGame: React.FC<Props> = ({ updateFilters }) => {
  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
    gameType: null,
    time: null,
    location: "tel-aviv", //use user session
    radius: 5,
    startDate: new Date() ,
    endDate: new Date(),
  });

  const onFilterChange = (key: string, value: any) => {
    if(key === 'time'){
      setFilters({...filters, time: key, startDate: getDateWithTime(filters.date,value[0]), endDate: getDateWithTime(filters.date,value[1]) })
    }else{
      setFilters({ ...filters, [key]: value });
    }
  };

  const getDateWithTime = (baseDate: Date, hourDecimal: number): Date => {
    const date = new Date(baseDate);
    const hours = Math.floor(hourDecimal);
    const minutes = Math.round((hourDecimal - hours) * 60);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  

  return (
    <div className="search-game">
      <p className="search-game__title text-subtitle mt-5 text-2xl font-medium">
        חיפוש משחק
      </p>
      <div className="search-game__filters mt-2 mb-2 flex gap-2">
        <DateFilter value={filters.date} onFilterChange={onFilterChange} />
        <TypeFilter onFilterChange={onFilterChange} />
      </div>
      <TimeSlider onFilterChange={onFilterChange} />
      <RadiusSlider onFilterChange={onFilterChange} />
      <Button
        className="bg-title my-5 w-[100%]"
        onClick={() => {
          updateFilters(filters);
        }}
      >
        חפש
      </Button>
    </div>
  );
};

export default SearchGame;
