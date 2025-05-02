import React, { useState } from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Game } from "@/app/types/Game";
import AvatarGroup from "./AvatarGroup";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PlayersList from "./PlayersList";
import { Button } from "./ui/button";

type Props = {
  game: Game;
};

const GameCard: React.FC<Props> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id, field, type, date, time, players, price } = game;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="relative">
      <div>
        <CollapsibleTrigger className="absolute top-2 left-2 z-10">
          {!isOpen && <IoIosArrowDown />}
          {isOpen && <IoIosArrowUp />}
        </CollapsibleTrigger>
        <Button className="absolute top-2 left-10 z-10 h-auto min-h-0 rounded-sm bg-blue-500 px-2.5 py-1.5 text-[12px] leading-none font-semibold text-white">
          הצטרף
        </Button>
        <div className="flex items-start pr-5 text-right">
          <div className="game-details">
            <span className="flex items-center gap-3 text-[20px] font-medium text-blue-400">
              {type.toLowerCase() === "basketball" ? (
                <PiBasketball />
              ) : type.toLowerCase() === "soccer" ? (
                <PiSoccerBall />
              ) : null}
              <span className={`max-w-[150px] ${!isOpen ? "truncate" : ""}`}>
                {field.name}
              </span>
            </span>
            <p className="text-gray-500">
              {date} | {time} {price && "|" + price + "₪"}
            </p>
            {!isOpen && <AvatarGroup players={players} />}
          </div>
        </div>
      </div>
      <CollapsibleContent className="mt-2 max-h-[200px] overflow-y-auto">
        <PlayersList players={players} />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default GameCard;
