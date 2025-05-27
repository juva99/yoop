import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import Link from "next/link";
import AvatarGroup from "./AvatarGroup";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { Card } from "./ui/card";

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
    weatherTemp,
    weatherIcon,
  } = game;

  const users = gameParticipants
    .filter((gp) => gp.status === ParticipationStatus.APPROVED)
    .map((participant) => participant.user);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedDate = start.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedStartTime = start.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedEndTime = end.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className="flex w-full flex-col gap-1 text-right">
      {/* כותרת */}
      <div className="text-title flex items-center gap-2 text-base font-semibold">
        {gameType === GameType.BasketBall ? (
          <PiBasketball className="text-lg" />
        ) : (
          <PiSoccerBall className="text-lg" />
        )}
        <span>{field.fieldName}</span>
      </div>

      {/* שורת מידע אחת */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
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
      </div>

      <p className="text-sm text-gray-600">
        רשומים: {game.maxParticipants}/{game.gameParticipants.length}
      </p>
      <AvatarGroup players={users} />
    </div>
  );
};

export default GameCardContent;
