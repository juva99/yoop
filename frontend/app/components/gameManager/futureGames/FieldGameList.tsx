"use client";

import React, { useEffect, useState } from "react";
import FieldGamesFilters from "./FieldGamesFilters";
import GameItem from "@/app/field-manager/field/[field_id]/games/GameItem";
import { Game } from "@/app/types/Game";
import { authFetch } from "@/lib/authFetch";
import { GameStatus } from "@/app/enums/game-status.enum";

type Props = {
  fieldId: string;
};

const FieldGameList: React.FC<Props> = ({ fieldId }) => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState({
    available: true,
    pending: true,
    finished: false,
  });

  const currentDate = new Date();

  const fetchGames = async () => {
    setLoading(true);
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/fieldId/${fieldId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await res.json();
    if (Array.isArray(data)) {
      // מיון לפי תאריך סיום מהישן לחדש
      const sorted = data.sort(
        (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
      );
      setAllGames(sorted);
      applyFilters(sorted, filters); // הפעלת פילטר ראשונית
    } else {
      console.error("Expected array, got:", data);
      setAllGames([]);
      setFilteredGames([]);
    }
    setLoading(false);
  };

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
        (available && game.status === GameStatus.AVAILABLE) ||
        (pending && game.status === GameStatus.PENDING)
      );
    });

    setFilteredGames(filtered);
  };

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
    (g) => g.status === GameStatus.AVAILABLE,
  ).length;
  const pendingCount = allGames.filter(
    (g) => g.status === GameStatus.PENDING,
  ).length;
  const finishedCount = allGames.filter(
    (g) => new Date(g.endDate) < currentDate,
  ).length;

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="field__game-list p-4">
      <FieldGamesFilters
        onFilterChange={handleFilterChange}
        availableCount={availableCount}
        pendingCount={pendingCount}
        finishedCount={finishedCount}
      />
      {loading ? (
        <p>טוען משחקים...</p>
      ) : filteredGames.length === 0 ? (
        <p>אין משחקים להצגה</p>
      ) : (
        <div>
          {filteredGames.map((game) => (
            <GameItem
              key={game.gameId}
              game={game}
              onStatusChange={fetchGames}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldGameList;
