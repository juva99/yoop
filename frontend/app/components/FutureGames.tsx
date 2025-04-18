"use client";
import React  from "react";
import { Game } from "@/app/types/Game";
import { useState } from "react";
import GameCard from "./GameCard";
import Filter from "./Filter";
import { GoTriangleDown } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";

type Games = {
    games: Game[];
};

const FutureGames: React.FC<Games> = ({games}) => {
    const [currentGame, setCurrentGame] = useState(0);
    const [startY, setStartY] = useState(0);
  
    const handleTouchStart = (e: React.TouchEvent) => {
      setStartY(e.touches[0].clientY);
    };
  
    const handleTouchEnd = (e: React.TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
  
      if (deltaY > 50 && currentGame > 0) {
        // Swipe up → previous card
        setCurrentGame((prev) => prev - 1);
      } else if (deltaY < -50 && currentGame < games.length - 1) {
        // Swipe down → next card
        setCurrentGame((prev) => prev + 1);
      }
    };
    return (
        <div className="w-full overflow-hidden flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <div onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
            <p>משחקים רשומים</p>
                <GameCard field_name={games[currentGame].field_name} type={games[currentGame].type} time={games[currentGame].time} date={games[currentGame].date} players={games[currentGame].players} price={games[currentGame].price}/>
            </div>
            <ul className="space-y-2">
                 {games.map((game,i) => (<li key={i}><div className={`w-3 h-3 cursor-pointer rounded-full ${currentGame == i ? 'bg-black' : 'bg-gray-200'}`} onClick={() => setCurrentGame(i)} /></li>))}
            </ul>
            <Filter text="מיקום" icon={<FaLocationDot color="gray"/>
}/>
        </div>
    )
}

export default FutureGames;