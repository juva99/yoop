import React from 'react';
import { PiBasketball, PiPlus, PiSoccerBall } from 'react-icons/pi';
import { Game } from '@/app/types/Game';
import GameCard from './GameCard';

const GameOverview: React.FC<Game> = ({ field_name, type, date, time, players, price }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <GameCard field_name={field_name} type={type} date={date} time={time} players={players} price={price}/>
            <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center border-2 rounded-full cursor-pointer">
                    <PiPlus className="text-blue-400 " />
                </button>
            </div>
        </div>
    );
};

export default GameOverview;