import React from 'react';
import { PiBasketball, PiPlus, PiSoccerBall } from 'react-icons/pi';
import { Game } from '@/app/types/Game';
import GameCard from './GameCard';

interface Props{
    game: Game 
}

const GameOverview: React.FC<Props> = ({ game }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl  shadow-xl border-1 border-[#e5e5e6]">
            <GameCard game={game}/>
            <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center border-2 rounded-full cursor-pointer">
                    <PiPlus className="text-blue-400 " />
                </button>
            </div>
        </div>
    );
};

export default GameOverview;
