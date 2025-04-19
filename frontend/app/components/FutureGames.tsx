"use client";
import React  from "react";
import { Game } from "@/app/types/Game";
import { useState } from "react";
import GameCard from "./GameCard";
import Filter from "./Filter";
import { GoTriangleDown } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { useSwipeable } from 'react-swipeable';


type Games = {
    games: Game[];
};



const FutureGames: React.FC<Games> = ({games}) => {
    const [currentGame, setCurrentGame] = useState(0);

  const handlers = useSwipeable({
    onSwipedDown: () => {downHandler();
    },
    onSwipedUp: () => {upHandler()}
  });

  const downHandler = () => {
    if(currentGame == games.length-1){
        setCurrentGame(0);
    }else{
      setCurrentGame(prev => prev + 1);
    }
  }

  const upHandler = () => {
    if(currentGame == 0){
      setCurrentGame(games.length-1);
  }else{
    setCurrentGame(prev => prev - 1);
  }
  }
  
    return (
      <div
      {...handlers}
      className="flex justify-between relative w-full max-w-md h-[130px] overflow-hidden border-1 rounded-2xl"
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
      <div className="bullets-container flex items-center h-[130px] left-0 pl-5">
      <ul className="space-y-2">
                 {games.map((game,i) => (<li key={i}><div className={`w-3 h-3 cursor-pointer rounded-full ${currentGame == i ? 'bg-black' : 'bg-gray-200'}`} onClick={() => setCurrentGame(i)} /></li>))}
            </ul>
      </div>
      </div>
    )
}

export default FutureGames;