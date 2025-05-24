"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/app/types/User";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { PiCrownSimpleBold } from "react-icons/pi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { GameParticipant } from "@/app/types/GameParticipant";
import ChangeParticipationButton from "./changeParticipationButton";

interface Props {
  gameId: string;
  gameParticipants: GameParticipant[];
  creatorUID: string;
  currUserUID?: string;
  deleteEnable: boolean;
  status: ParticipationStatus;
}

const PlayersList: React.FC<Props> = ({
  gameId,
  creatorUID,
  currUserUID,
  gameParticipants,
  deleteEnable,
  status,
}) => {
  const formatPhoneNumber = (phoneNum: string) => {
    return `972${phoneNum.substring(1)}`;
  };

  const isCreator = creatorUID === currUserUID;

  return (
    <div className="players flex flex-col items-start gap-2">
      <div className="flex w-full flex-col space-y-1">
        {gameParticipants
          .filter((gameParticipant) => gameParticipant.status === status)
          .map((gameParticipant, index) => {
            const player = gameParticipant.user;

            return (
              <div
                key={index}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-full border-2 border-white">
                    <AvatarImage
                      src={player.profilePic}
                      alt={player.firstName}
                    />
                    <AvatarFallback>
                      {player.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{player.firstName + " " + player.lastName}</span>
                  {player.uid === creatorUID && (
                    <PiCrownSimpleBold className="" />
                  )}
                </div>
                <div className="flex items-center gap-2 pl-4">
                  {isCreator && deleteEnable && player.uid !== currUserUID && (
                    <ChangeParticipationButton
                      gameId={gameId}
                      uid={player.uid}
                      status={ParticipationStatus.REJECTED}
                      icon={
                        <TiDeleteOutline className="text-lg text-[#f44e38]" />
                      }
                    />
                  )}
                  {isCreator &&
                    deleteEnable &&
                    player.uid !== currUserUID &&
                    status === ParticipationStatus.PENDING && (
                      <ChangeParticipationButton
                        gameId={gameId}
                        uid={player.uid}
                        status={ParticipationStatus.APPROVED}
                        icon={
                          <AiOutlineCheckCircle className="text-[#2563EB]" />
                        }
                      />
                    )}
                  {player.phoneNum && (
                    <a
                      href={`https://wa.me/${formatPhoneNumber(player.phoneNum)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp size={20} className="text-[#25D366]" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlayersList;
