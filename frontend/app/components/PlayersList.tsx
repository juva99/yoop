"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { PiCrownSimpleBold } from "react-icons/pi";

import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { GameParticipant } from "@/app/types/GameParticipant";

import ChangeParticipationButton from "./changeParticipationButton";
import { is } from "date-fns/locale";

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
  const filteredParticipants = gameParticipants
    .filter((gameParticipant) => gameParticipant.status === status)
    .sort((a, b) => {
      if (a.user.uid === currUserUID) return -1;
      if (b.user.uid === currUserUID) return 1;
      return 0;
    });

  const isCreator = creatorUID === currUserUID;
  if (!filteredParticipants || filteredParticipants.length === 0) {
    return <span className="text-sm text-gray-500">אין שחקנים לתצוגה</span>;
  }
  return (
    <div className="players flex flex-col items-start gap-2">
      <div className="flex w-full flex-col space-y-1">
        {filteredParticipants.map((gameParticipant, index) => {
          const player = gameParticipant.user;
          const isCurrentUser = player.uid === currUserUID;
          return (
            <div
              key={index}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-full border-2 border-white">
                  <AvatarImage src={player.profilePic} alt={player.firstName} />
                  <AvatarFallback>{player.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{player.firstName + " " + player.lastName}</span>
                {player.uid === creatorUID ? (
                  <PiCrownSimpleBold className="" />
                ) : (
                  !isCurrentUser &&
                  status === ParticipationStatus.APPROVED && (
                    <img
                      src="/add_creator.png"
                      alt="Crown Plus Icon"
                      width={22}
                      height={22}
                    />
                  )
                )}
              </div>
              <div className="flex items-center gap-2 pl-4">
                {isCreator && deleteEnable && player.uid !== currUserUID && (
                  <ChangeParticipationButton
                    gameId={gameId}
                    uid={player.uid}
                    status={ParticipationStatus.REJECTED}
                    icon={
                      <CiCircleRemove
                        className="text-lg text-[#f44e38]"
                        size={20}
                      />
                    }
                  />
                )}
                {isCreator &&
                  deleteEnable &&
                  !isCurrentUser &&
                  status === ParticipationStatus.PENDING && (
                    <ChangeParticipationButton
                      gameId={gameId}
                      uid={player.uid}
                      status={ParticipationStatus.APPROVED}
                      icon={
                        <CiCircleCheck className="text-[#2563EB]" size={20} />
                      }
                    />
                  )}

                {player.phoneNum && !isCurrentUser && (
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
