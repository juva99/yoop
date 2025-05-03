"use client";
import { Game } from "@/app/types/Game";
import FilteredGames from "@/components/searchComponents/FilteredGames";
import SearchGame from "@/components/searchComponents/SearchGame";
import React, { useEffect, useState } from "react";
import MapView from "../MapView";

type Props = {};
type Filters = {
  gameType?: any;
  date?: any;
  startDate?: Date,
  endDate?: Date,
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
    const startDate = getDateWithTime(filters.date, filters.time[0]);
    const endDate = getDateWithTime(filters.date, filters.time[1]);
  
    const params = new URLSearchParams({
      gameType: filters.gameType || "",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      city: filters.location || "",
    });
    
    try {
      const response = await fetch(`http://localhost:3001/games/query?${params.toString()}`, {
        method: "GET",
      });
  
      const data = await response.json();
      console.log(data);
      setFilteredGames(data);
    } catch (e) {
      console.error("Failed to fetch games", e);
    }
  };
  


  useEffect(() => {
   fetchGames();
  },[filters]);

  const filtersHandler = (filters: Filters) => {
    setFilters(filters);
    // get req by filters
  };

  // fetch filtered games from server

  return (
    <div className="p-5">
      <SearchGame updateFilters={filtersHandler} />
      <MapView
        defaultLocation={{ lng: 34.79, lat: 32.13 }}
        games={filteredGames}
      />
      <FilteredGames games={filteredGames} />
    </div>
  );
};

export default Search;
