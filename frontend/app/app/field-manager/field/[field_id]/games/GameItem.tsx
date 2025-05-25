import React from "react";
import { Game } from "@/app/types/Game";
import { GameStatus } from "@/app/enums/game-status.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { PiSoccerBall } from "react-icons/pi";
import { PiBasketball } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa6";
import AproveRejectGame from "./AproveRejectGame";

interface Props {
  game: Game;
  onStatusChange: () => void;
}

const GameItem: React.FC<Props> = ({ game, onStatusChange }) => {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatPhoneNumber = (phoneNum: string) => {
    return `972${phoneNum.substring(1)}`;
  };
  return (
    <div className="flex justify-between border-b-1 border-gray-200 text-sm">
      <div className="flex flex-col gap-1 py-2">
        <div className="flex items-center gap-2">
          {game.gameType === GameType.FootBall ? (
            <PiSoccerBall />
          ) : (
            <PiBasketball />
          )}
          <span>{formatDate(game.startDate)}</span>
          <span>|</span>
          <span>
            {formatTime(game.startDate)}-{formatTime(game.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>יוצר:</span>
          <span>
            {game.creator.firstName} {game.creator.lastName}
          </span>
          <span></span>
          {game.creator.phoneNum && (
            <a
              href={`https://wa.me/${formatPhoneNumber(game.creator.phoneNum)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="text-[#25D366]" />
            </a>
          )}
        </div>
        {game.status === GameStatus.APPROVED && (
          <span>
            רשומים: {game.gameParticipants.length}/{game.maxParticipants}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {game.status === GameStatus.PENDING && (
          <AproveRejectGame
            gameId={game.gameId}
            onStatusChange={() => onStatusChange()}
          />
        )}
      </div>
    </div>
  );
};

export default GameItem;
