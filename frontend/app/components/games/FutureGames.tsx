"use client";
import React, { useMemo } from "react";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Game } from "@/app/types/Game";
import GameCardContent from "./GameCardContent";
import Link from "next/link";
type Props = {
  games: Game[];
};

const FutureGames: React.FC<Props> = ({ games }) => {
  const [currentGame, setCurrentGame] = useState(0);

  const futureGames = useMemo(() => {
    const now = new Date();
    return games
      .filter((game) => new Date(game.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
  }, [games]);

  const handlers = useSwipeable({
    onSwipedDown: () => {
      upHandler();
    },
    onSwipedUp: () => {
      downHandler();
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
  });

  const downHandler = () => {
    if (currentGame == futureGames.length - 1) {
      setCurrentGame(0);
    } else {
      setCurrentGame((prev) => prev + 1);
    }
  };

  const upHandler = () => {
    if (currentGame == 0) {
      setCurrentGame(futureGames.length - 1);
    } else {
      setCurrentGame((prev) => prev - 1);
    }
  };

  return (
    <div
      {...handlers}
      className="relative flex max-h-[100px] w-full justify-between overflow-hidden"
    >
      {futureGames.length === 0 ? (
        <span className="flex text-center">אין משחקים לתצוגה</span>
      ) : (
        <>
          {" "}
          <div
            className="transition-transform duration-300"
            style={{ transform: `translateY(-${currentGame * 100}px)` }}
          >
            {futureGames.slice(0, 5).map((game, i) => (
              <div key={i} className="flex h-[100px] w-full items-center">
                <Link href={`/game/${game.gameId}`}>
                  <GameCardContent game={game} />
                </Link>
              </div>
            ))}
          </div>
          <div className="bullets-container left-0 flex h-[100px] items-center">
            <ul className="space-y-2">
              {futureGames.slice(0, 5).map((game, i) => (
                <li key={i}>
                  <div
                    className={`h-3 w-3 cursor-pointer rounded-full ${currentGame == i ? "bg-black" : "bg-gray-200"}`}
                    onClick={() => setCurrentGame(i)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FutureGames;
