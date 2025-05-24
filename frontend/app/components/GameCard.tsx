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
  return (
    <Link href={`/game/${game.gameId}`} dir="rtl">
      <Card variant="game">
        <GameCardContent game={game} />
      </Card>
    </Link>
  );
};

export default GameCard;
