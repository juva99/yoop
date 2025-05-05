import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import Link from "next/link";
import AvatarGroup from "./AvatarGroup";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";

type Props = {
  game: Game;
};

const GameCard: React.FC<Props> = ({ game }) => {
  const {
    gameId,
    gameType,
    startDate,
    endDate,
    maxParticipants,
    status,
    gameParticipants,
    creator,
    field,
    price,
    weatherTemp,
    weatherCondition,
    weatherIcon,
  } = game;

  // Ensure startDate is a Date object
  const dateObject =
    typeof startDate === "string" ? new Date(startDate) : startDate;

  const users = gameParticipants
    .filter((gp) => gp.status === ParticipationStatus.APPROVED)
    .map((participant) => participant.user);

  // Define a consistent locale for formatting
  const locale = "he-IL"; // Use Hebrew (Israel) locale

  return (
    <Link href={`/game/${gameId}`}>
      <div className="flex h-[130px] items-center pr-5 text-right">
        <div className="game-details">
          <span className="flex items-center gap-3 text-[24px] font-medium text-blue-400">
            {gameType.toLowerCase() === "basketball" ? (
              <PiBasketball />
            ) : gameType.toLowerCase() === "soccer" ? (
              <PiSoccerBall />
            ) : null}
            {field.fieldName}
          </span>
          <span>
          <p className="text-gray-500">
          <span className="flex items-center gap-1">
            {dateObject.toLocaleDateString(locale, {
              month: "numeric",
              day: "numeric",
            })}{" "}
            |{" "}
            {dateObject.toLocaleTimeString(locale, {
              hour: "numeric",
              minute: "2-digit",
              hour12: false,
            })}{" "}
            {price && `| ${price}₪`}

                {weatherTemp + "°"}
                <img src={weatherIcon} alt="Weather Icon" className="w-7 h-7" />
            </span>
          </p>
          </span>
          <AvatarGroup players={users} />
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
