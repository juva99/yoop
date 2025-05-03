"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import GameCard from "./GameCard";
import { useSwipeable } from "react-swipeable";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { authFetch } from "@/lib/authFetch";

// type Games = {
//   games: Game[];
// };

const FutureGames: React.FC = () => {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(0);
  
  const fetchGames = async () => {
    const session = await getSession();
    if (!session?.user?.uid) {
      console.error("Invalid session or user credentials");
      redirect("/auth/login");
    }
    console.log(session.user.uid);
    
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/mygames`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGames(data);
    } catch (e) {
      console.error("Failed to fetch games", e);
      setGames([]);
    }
  };


  useEffect (() => {
    fetchGames()
  },[]);

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
      className="border-elements relative flex h-[130px] w-full max-w-md justify-between overflow-hidden rounded-2xl border-1 shadow"
    >
      <div
        className="transition-transform duration-300"
        style={{ transform: `translateY(-${currentGame * 130}px)` }}
      >
        {games.map((game, i) => (
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
    </div>
  );
};

export default FutureGames;
