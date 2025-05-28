"use client";
import { Game } from "@/app/types/Game";
import React, { useState } from "react";
import GameCard from "../GameCard";
import ExpandableGameCard from "../ExpandableGameCard";
import { Card } from "../ui/card";

type Props = {
  games: Game[];
};

const FilteredGames: React.FC<Props> = ({ games }) => {
  let availables = 0;
  games.forEach((game) => {
    if (game.maxParticipants > game.gameParticipants.length) {
      availables++;
    }
  });
  return (
    <div className="mt-4 w-[100%] items-center overflow-hidden">
      <p className="text-sm font-semibold">
        <span className="text-title">{games.length} נמצאו</span>{" "}
        <span className="text-subtitle">{availables} פנוים להרשמה</span>
      </p>
      <div className="filtered-games__list max-h-100 overflow-y-auto">
        {games.map((g, i) => (
          <div key={i}>
            <GameCard game={g} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredGames;
