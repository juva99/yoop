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
  startDate?: Date,
  endDate?: Date,
  time?: any;
  location?: any;
  radius?: any;
};

const sampleGame = {
  id: "g1",
  field: { name: "עמק אילון 9, תל אביב", lng: 34.79, lat: 32.13 },
  type: "soccer",
  date: "4.10",
  time: "16:00",
  players: [
    { name: "אלכס", image: "bla.ico", phoneNum: "0527345050" },
    { name: "גיימס", image: "bla.ico", phoneNum: "0527345050" },
    { name: "אלפא", image: "bla.ico", phoneNum: "0527345050" },
    { name: "סקיבידי", image: "bla.ico", phoneNum: "0527345050" },
    { name: "ריזז", image: "bla.ico", phoneNum: "0527345050" },
    { name: "ריזז", image: "bla.ico", phoneNum: "0527345050" },
    { name: "ריזז", image: "bla.ico", phoneNum: "0527345050" },
  ],
  price: 30,
};
const sampleGame2 = {
  id: "g2",
  field: { name: "עמק יזרעאל 9", lng: 34.81, lat: 32.15 },
  gameType: "soccer",
  date: "4.10",
  time: "16:00",
  players: [
    { name: "Player 1", image: "favicon.ico", phoneNum: "0527345050" },
    { name: "Player 2", image: "favicon.ico", phoneNum: "0527345050" },
    { name: "Player 3", image: "favicon.ico", phoneNum: "0527345050" },
    { name: "Player 4", image: "favicon.ico", phoneNum: "0527345050" },
    { name: "Player 5", image: "favicon.ico", phoneNum: "0527345050" },
  ],
  price: 30,
};
const Search: React.FC<Props> = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([

  ]);

  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
    type: null,
    time: null,
    startDate: new Date(),
    endDate: new Date(),
    location: "tel-aviv",
    radius: 10, 
  });

  const fetchGames = async () => {
    const params = {gameType: filters.type, startDate: filters.startDate, endDate: filters.endDate, city: filters.location}
    const queyParams = new URLSearchParams(params.toString());
    const response = await fetch(`http://localhost:3001/games/query?${queyParams}`, {
       method: "GET"
     });
     try{
       const data = await response.json();
       console.log(data);
       
       setFilteredGames(data)
     }catch(e){
      console.log(e);
     }
  }


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
        games={[sampleGame, sampleGame2]}
      />
      <FilteredGames games={filteredGames} />
    </div>
  );
};

export default Search;
