"use client";

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
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { useRouter } from "next/navigation";
import { GameType } from "@/app/enums/game-type.enum";

type Props = {
  game: Game;
  buttonTitle: string;
};

const ExpandableGameCard: React.FC<Props> = ({ game, buttonTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formattedDate = start.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = start.toLocaleTimeString("he-IL", {
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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="relative space-y-2 rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="text-title flex items-center gap-3 font-medium">
          {gameType === GameType.BasketBall ? (
            <PiBasketball />
          ) : (
            <PiSoccerBall />
          )}
          <span className="truncate">{field.fieldName}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            onClick={() => router.push(`/game/${gameId}`)}
            className="bg-title rounded px-3 py-1 text-xs text-white"
          >
            {buttonTitle}
          </Button> */}
          {/* <CollapsibleTrigger className="text-xl text-gray-500">
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </CollapsibleTrigger> */}
        </div>
      </div>

      <div className="flex gap-2 text-sm text-gray-600">
        {formattedDate} | {formattedTime} {price && `| ${price}₪`} |{" "}
        {weatherTemp && (
          <span className="flex items-center gap-1">
            {weatherTemp}°
            <img src={weatherIcon} alt="Weather Icon" className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <p>
          ({game.maxParticipants}/ {game.gameParticipants.length})
        </p>
        {!isOpen && <AvatarGroup players={users} />}
      </div>

      {/* <CollapsibleContent className="mt-2 max-h-[200px] overflow-y-auto">
        <PlayersList
          gameId={gameId}
          creatorUID={creator.uid}
          gameParticipants={gameParticipants}
          status={ParticipationStatus.APPROVED}
          deleteEnable={false}
        />
      </CollapsibleContent>  */}
    </Collapsible>
  );
};

export default ExpandableGameCard;
