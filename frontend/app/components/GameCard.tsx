import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { Game } from "@/app/types/Game";
import Link from "next/link";
import AvatarGroup from "./AvatarGroup";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { Card } from "./ui/card";
import GameCardContent from "./GameCardContent";

type Props = {
  game: Game;
};

const GameCard: React.FC<Props> = ({ game }) => {
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
    <Link href={`/game/${gameId}`} dir="rtl">
      <Card variant="game">
        <GameCardContent game={game} />
      </Card>
    </Link>
  );
};

export default GameCard;
