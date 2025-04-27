"use client";
import FilteredGames from "@/components/searchComponents/FilteredGames";
import SearchGame from "@/components/searchComponents/SearchGame";
import React, { useEffect, useState } from "react";
import { Game } from "../types/Game";

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
  field_name: "עמק אילון 9",
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
  field_name: "עמק  9",
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
const page: React.FC<Props> = () => {
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
  return (
    <div className="p-5">
      <SearchGame updateFilters={filtersHandler} />
      <FilteredGames games={filteredGames} />
    </div>
  );
};

export default page;
