"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import GameCard from "./GameCard";
import { useSwipeable } from "react-swipeable";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { Game } from "@/app/types/Game";

type Props = {
  games: Game[];
};

const FutureGames: React.FC<Props> = ({ games }) => {
  const [currentGame, setCurrentGame] = useState(0);

  const handlers = useSwipeable({
    onSwipedDown: (eventData) => {
      upHandler();
    },
    onSwipedUp: (eventData) => {
      downHandler();
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
  });

  const downHandler = () => {
    if (currentGame == games.length - 1) {
      setCurrentGame(0);
    } else {
      setCurrentGame((prev) => prev + 1);
    }
  };

  const upHandler = () => {
    if (currentGame == 0) {
      setCurrentGame(games.length - 1);
    } else {
      setCurrentGame((prev) => prev - 1);
    }
  };

  return (
    <div
      {...handlers}
      className="relative flex h-[130px] w-full max-w-md items-center justify-between overflow-hidden rounded-xl border-1 border-gray-200"
    >
      {games.length === 0 ? (
        <span className="text-subtitle mr-3 text-2xl">אין משחקים עתידיים</span>
      ) : (
        <>
          {" "}
          <div
            className="transition-transform duration-300"
            style={{ transform: `translateY(-${currentGame * 130}px)` }}
          >
            {games.slice(0, 5).map((game, i) => (
              <div key={i} className="h-[130px]">
                <GameCard game={game} />
              </div>
            ))}
          </div>
          <div className="bullets-container left-0 flex h-[130px] items-center pl-5">
            <ul className="space-y-2">
              {games.slice(0, 5).map((game, i) => (
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
