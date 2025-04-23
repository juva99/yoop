"use client";
import FilteredGames from "@/components/game/FilteredGames";
import SearchGame from "@/components/game/SearchGame";
import React, { useEffect, useState } from "react";
import { Game } from "../types/Game";

type Props = {};

const page: React.FC<Props> = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  return (
    <div className="p-10">
      <SearchGame />
      <div className="mt-4 h-70 w-[100%]">
        <FilteredGames games={filteredGames} />
      </div>
    </div>
  );
};

export default page;
