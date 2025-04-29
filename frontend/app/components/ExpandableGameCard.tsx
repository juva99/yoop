import React, { useState } from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Game } from "@/app/types/Game";
import AvatarGroup from "./AvatarGroup";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import PlayersList from "./PlayersList";

type Props = {
  game: Game;
};

const GameCard: React.FC<Props> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id, field, type, date, time, players, price } = game;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="relative"
    >
      <div >
      <CollapsibleTrigger className="absolute left-2 top-2 z-10">
        {!isOpen && <IoIosArrowDown />}
        {isOpen && <IoIosArrowUp />}
      </CollapsibleTrigger>
      <div className="flex items-center pr-5 text-right">
        <div className="game-details">
          <span className="flex items-center gap-3 text-[24px] font-medium text-blue-400">
            {type.toLowerCase() === "basketball" ? (
              <PiBasketball />
            ) : type.toLowerCase() === "soccer" ? (
              <PiSoccerBall />
            ) : null}
            {field.name}
          </span>
          <p className="text-gray-500">
            {date} | {time} {price && "|" + price + "₪"}
          </p>
          {!isOpen && <AvatarGroup players={players} />}
        </div>
        </div>
      </div>
      <CollapsibleContent className="max-h-[200px] overflow-y-auto">
        <PlayersList players={players}/>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default GameCard;
