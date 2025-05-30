"use client";

import React, { useEffect, useState } from "react";
import FieldGamesFilters from "./FieldGamesFilters";
import GameItem from "@/app/field-manager/field/[field_id]/games/GameItem";
import { Game } from "@/app/types/Game";
import { authFetch } from "@/lib/authFetch";
import { GameStatus } from "@/app/enums/game-status.enum";

type Props = {
  games: Game[];
};

const FieldGameList: React.FC<Props> = ({ games }) => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const [filters, setFilters] = useState({
    available: true,
    pending: true,
    finished: false,
  });

  const currentDate = new Date();
  const applyFilters = (
    games: Game[],
    {
      available,
      pending,
      finished,
    }: { available: boolean; pending: boolean; finished: boolean },
  ) => {
    const now = new Date();

    const filtered = games.filter((game) => {
      const gameDate = new Date(game.endDate);
      const isFinished = gameDate < now;

      if (isFinished && !finished) {
        return false;
      }

      return (
        (finished && isFinished) ||
        (available && game.status === GameStatus.APPROVED) ||
        (pending && game.status === GameStatus.PENDING)
      );
    });

    setFilteredGames(filtered);
  };

  useEffect(() => {
    if (Array.isArray(games)) {
      const sorted = [...games].sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
      );
      setAllGames(sorted);
      applyFilters(sorted, filters);
    } else {
      console.error("Expected array, got:", games);
      setAllGames([]);
      setFilteredGames([]);
    }
  }, [games]);

  const handleFilterChange = (
    showAvailable: boolean,
    showPending: boolean,
    showFinished: boolean,
  ) => {
    const updated = {
      available: showAvailable,
      pending: showPending,
      finished: showFinished,
    };
    setFilters(updated);
    applyFilters(allGames, updated);
  };

  const availableCount = allGames.filter(
    (g) => g.status === GameStatus.APPROVED,
  ).length;
  const pendingCount = allGames.filter(
    (g) => g.status === GameStatus.PENDING,
  ).length;
  const finishedCount = allGames.filter(
    (g) => new Date(g.endDate) < currentDate,
  ).length;

  return (
    <div>
      <FieldGamesFilters
        onFilterChange={handleFilterChange}
        availableCount={availableCount}
        pendingCount={pendingCount}
        finishedCount={finishedCount}
      />
      {filteredGames.length === 0 ? (
        <p>אין משחקים להצגה</p>
      ) : (
        <div>
          {filteredGames.map((game) => (
            <GameItem key={game.gameId} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldGameList;
