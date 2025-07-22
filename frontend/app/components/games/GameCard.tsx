import React from "react";
import { Game } from "@/app/types/Game";
import Link from "next/link";
import { Card } from "../ui/card";
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
