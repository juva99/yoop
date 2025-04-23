"use client";
import React from "react";
import Filter from "@/components/Filter";
import { PiSoccerBall } from "react-icons/pi";
import { PiBasketball } from "react-icons/pi";
import { PiCalendarDuotone } from "react-icons/pi";
import { useState } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import TimeSlider from "./TimeSlider";
import RadiusSlider from "./RadiusSlider";
import { MapView } from "../MapView";
import FilterDate from "./FilterDate";

type Props = {
  // your props here
};

type Filters = {
  type?: any;
  date?: any;
  time?: any;
  location?: any;
  radius?: any;
};

const SearchGame: React.FC<Props> = ({}) => {
  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
  });

  const typeOptions = [
    { label: "כדורסל", value: "basketball", icon: <PiBasketball /> },
    { label: "כדורגל", value: "soccer", icon: <PiSoccerBall /> },
  ];

  return (
    <div className="search-game">
      <p className="search-game__title text-subtitle mt-5 text-2xl font-medium">
        חיפוש משחק
      </p>
      <div className="search-game__filters mt-2 mb-2 flex gap-2">
        <Filter
          text="איזה משחק?"
          icon={<></>}
          options={typeOptions}
          value={filters.type}
          onChange={(newType) => setFilters({ ...filters, type: newType })}
        />
        <FilterDate
          value={filters.date}
          onChange={(date) => setFilters({ ...filters, date })}
        />
      </div>
      <TimeSlider />
      <RadiusSlider />
      <MapView />
    </div>
  );
};

export default SearchGame;
