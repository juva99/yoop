import React from 'react';
import { PiBasketball, PiPlus, PiSoccerBall } from 'react-icons/pi';

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

const GameOverview: React.FC<GameInfo> = ({ field_name, game_type, date, time, players }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <div className="text-right">
                <h3 className="text-blue-400 text-2xl font-bold flex items-center gap-3">
                    {game_type.toLowerCase() === "basketball"
                        ? <PiBasketball />
                        : game_type.toLowerCase() === "soccer"
                            ? <PiSoccerBall />
                            : null}
                    {field_name}
                </h3>
                <p className="text-gray-500">{date} | {time}</p>
                <div className="flex items-center gap-3 mt-2 justify-end">
                    <div className="flex gap-x-1">
                        {players.slice(0, 4).map((player, index) => (
                            <img
                                key={index}
                                src={player.image}
                                alt={player.name}
                                className="w-8 h-8 rounded-full border-2 border-white"
                            />
                        ))}
                    </div>
                    {players.length > 4 && <span className="text-blue-600 font-bold">+{players.length - 4}</span>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center border-2 rounded-full">
                    <PiPlus className="text-blue-400" />
                </button>
            </div>
        </div>
    );
};

export default GameOverview;