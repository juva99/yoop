"use client";
import { Game } from "@/app/types/Game";
import FilteredGames from "@/components/searchComponents/FilteredGames";
import SearchGame from "@/components/searchComponents/SearchGame";
import React, { useEffect, useState } from "react";
import MapView from "../MapView";

type Props = {};
type Filters = {
  type?: any;
  date?: any;
  time?: any;
  location?: any;
  radius?: any;
};

const Search: React.FC<Props> = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
    type: null,
    time: null,
    location: "tel-aviv",
    radius: 10,
  });

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
