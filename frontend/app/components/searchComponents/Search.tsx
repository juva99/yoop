"use client";
import { Game } from "@/app/types/Game";
import FilteredGames from "@/components/searchComponents/FilteredGames";
import SearchGame from "@/components/searchComponents/SearchGame";
import React, { useEffect, useState } from "react";
import MapView from "../MapView";
import { BACKEND_URL } from "@/lib/constants";

type Props = {};
type Filters = {
  gameType?: any;
  date?: any;
  startDate?: Date;
  endDate?: Date;
  time?: any;
  location?: any;
  radius?: any;
};

const getDateWithTime = (baseDate: Date, hourDecimal: number): Date => {
  const date = new Date(baseDate);
  const hours = Math.floor(hourDecimal);
  const minutes = Math.round((hourDecimal - hours) * 60);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const Search: React.FC<Props> = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
    gameType: null,
    time: null,
    startDate: new Date(),
    endDate: new Date(),
    location: "tel aviv",
    radius: 10,
  });

  const fetchGames = async () => {
    if (!filters.date || !filters.time) {
      console.log("Date or time filter not set, skipping fetch.");
      setFilteredGames([]);
      return;
    }

    const startDate = getDateWithTime(filters.date, filters.time[0]);
    const endDate = getDateWithTime(filters.date, filters.time[1]);

    const params = new URLSearchParams({
      gameType: filters.gameType || "",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      city: filters.location || "",
    });
    console.log(filters);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/query?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFilteredGames(data);
    } catch (e) {
      console.error("Failed to fetch games", e);
      setFilteredGames([]);
    }
  };

  useEffect(() => {
    if (filters.date && filters.time) {
      fetchGames();
    }
  }, [filters]);

  const filtersHandler = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-5">
      <SearchGame updateFilters={filtersHandler} />
      {filteredGames.length ? (
        <MapView
          defaultLocation={{ lng: 34.79, lat: 32.13 }}
          games={filteredGames}
        />
      ) : (
        ""
      )}
      <FilteredGames games={filteredGames} />
    </div>
  );
};

export default Search;
