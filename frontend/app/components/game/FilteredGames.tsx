"use client";
import { Game } from "@/app/types/Game";
import React, { useState } from "react";

type Props = {
  games: Game[];
};

const FilteredGames: React.FC<Props> = ({ games }) => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [availables, setAvailables] = useState<Game[]>([]);

  return (
    <div className="flex items-center">
      <p>
        <span className="text-title ml-2 text-xl">{games.length} נמצאו</span>
        <span className="text-subtitle">{availables.length} פנוים להרשמה</span>
      </p>
    </div>
  );
};

export default FilteredGames;
