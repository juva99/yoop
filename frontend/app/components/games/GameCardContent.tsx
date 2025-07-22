import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import AvatarGroup from "../friends/AvatarGroup";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { GameStatus } from "@/app/enums/game-status.enum";

type Props = {
  game: Game;
};

const GameCardContent: React.FC<Props> = ({ game }) => {
  const {
    gameId,
    gameType,
    startDate,
    endDate,
    gameParticipants,
    field,
    price,
    status,
    weatherTemp,
    weatherIcon,
  } = game;

  const approvedPlayers = gameParticipants
    .filter((gp) => gp.status === ParticipationStatus.APPROVED)
    .map((participant) => participant.user);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedDate = start.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  });

  const formattedStartTime = start.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jerusalem",
  });

  const formattedEndTime = end.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jerusalem",
  });

  return (
    <div className="flex w-full flex-col gap-1 text-right text-sm">
      {/* כותרת */}
      <div className="text-title flex items-center gap-2 font-semibold">
        {gameType === GameType.BasketBall ? (
          <PiBasketball className="text-lg" />
        ) : (
          <PiSoccerBall className="text-lg" />
        )}
        <span>{field.fieldName}</span>
      </div>

      {/* שורת מידע אחת */}
      <div className="flex flex-wrap items-center gap-2 text-gray-600">
        <span>{formattedDate}</span>
        <span>|</span>
        <span>{`${formattedStartTime} - ${formattedEndTime}`}</span>
        {price && (
          <>
            <span>|</span>
            <span>{price}₪</span>
          </>
        )}
        {weatherTemp && (
          <>
            <span>|</span>
            <span className="flex items-center gap-1">
              {weatherTemp}°
              {weatherIcon && (
                <img
                  src={weatherIcon}
                  alt="Weather Icon"
                  className="h-5 w-5 object-contain"
                />
              )}
            </span>
          </>
        )}
        {status === GameStatus.PENDING ? (
          <div className="flex flex-row gap-2">
            <span>🟠</span>
            <span>בהמתנה לאישור מנהל</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              רשומים: {approvedPlayers.length}/{game.maxParticipants}
            </p>
            <span>|</span>
            <AvatarGroup players={approvedPlayers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCardContent;
