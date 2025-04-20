import React from "react";
import { PiBasketball, PiPlus, PiSoccerBall } from "react-icons/pi";

interface Player {
  name: string;
  image: string;
}

interface GameInfo {
  field_name: string;
  game_type: string;
  date: string;
  time: string;
  players: Player[];
}

const GameOverview: React.FC<GameInfo> = ({
  field_name,
  game_type,
  date,
  time,
  players,
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
      <div className="text-right">
        <h3 className="flex items-center gap-3 text-2xl font-bold text-blue-400">
          {game_type.toLowerCase() === "basketball" ? (
            <PiBasketball />
          ) : game_type.toLowerCase() === "soccer" ? (
            <PiSoccerBall />
          ) : null}
          {field_name}
        </h3>
        <p className="text-gray-500">
          {date} | {time}
        </p>
        <div className="mt-2 flex items-center justify-end gap-3">
          <div className="flex gap-x-1">
            {players.slice(0, 4).map((player, index) => (
              <img
                key={index}
                src={player.image}
                alt={player.name}
                className="h-8 w-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          {players.length > 4 && (
            <span className="font-bold text-blue-600">
              +{players.length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded-full border-2">
          <PiPlus className="text-blue-400" />
        </button>
      </div>
    </div>
  );
};

export default GameOverview;
