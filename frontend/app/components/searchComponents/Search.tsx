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

const sampleGame = {
  id: "g1",
  field: { name: "עמק אילון 9", lng: 34.79, lat: 32.13 },
  type: "soccer",
  date: "4.10",
  time: "16:00",
  players: [
    { name: "אלכס", image: "bla.ico" },
    { name: "גיימס", image: "bla.ico" },
    { name: "אלפא", image: "bla.ico" },
    { name: "סקיבידי", image: "bla.ico" },
    { name: "ריזז", image: "bla.ico" },
    { name: "ריזז", image: "bla.ico" },
    { name: "ריזז", image: "bla.ico" },
  ],
  price: 30,
};
const sampleGame2 = {
  id: "g2",
  field: { name: "עמק יזרעאל 9", lng: 34.81, lat: 32.15 },
  type: "soccer",
  date: "4.10",
  time: "16:00",
  players: [
    { name: "Player 1", image: "favicon.ico" },
    { name: "Player 2", image: "favicon.ico" },
    { name: "Player 3", image: "favicon.ico" },
    { name: "Player 4", image: "favicon.ico" },
    { name: "Player 5", image: "favicon.ico" },
  ],
  price: 30,
};
const Search: React.FC<Props> = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([
    sampleGame,
    sampleGame2,
  ]);

  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
    type: null,
    time: null,
    location: "tel-aviv",
    radius: 10,
  });

  const filtersHandler = (filters: Filters) => {
    console.log(filters);

    setFilters(filters);
    // get req by filters
  };

  // fetch filtered games from server

  return (
    <div className="p-5">
      <SearchGame updateFilters={filtersHandler} />
      <MapView
        defaultLocation={{ lng: 34.79, lat: 32.13 }}
        games={[sampleGame, sampleGame2]}
      />
      <FilteredGames games={filteredGames} />
    </div>
  );
};

export default Search;
