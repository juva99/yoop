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

type Props = {
  game: Game;
};

const ExpandableGameCard: React.FC<Props> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(false);
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
  } = game;

  // Ensure startDate is a Date object
  const dateObject =
    typeof startDate === "string" ? new Date(startDate) : startDate;

  const users = gameParticipants.map((participant) => participant.user);

  // Define a consistent locale for formatting
  const locale = "he-IL"; // Use Hebrew (Israel) locale

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
              {gameType.toLowerCase() === "basketball" ? (
                <PiBasketball />
              ) : gameType.toLowerCase() === "football" ? (
                <PiSoccerBall />
              ) : null}
              <span className={`max-w-[150px] ${!isOpen ? "truncate" : ""}`}>
                {field.fieldName}
              </span>
            </span>
            <p className="text-gray-500">
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
            </p>
            {!isOpen && <AvatarGroup players={users} />}
          </div>
        </div>
      </div>
      <CollapsibleContent className="mt-2 max-h-[200px] overflow-y-auto">
        {/* <PlayersList
          gameId={gameId}
          creatorUID={creator.uid}
          gameParticipants={gameParticipants}
          status={ParticipationStatus.APPROVED}
          deleteEnable={false}
        />
        ///// waiting for pr to merge //////
        */}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableGameCard;
