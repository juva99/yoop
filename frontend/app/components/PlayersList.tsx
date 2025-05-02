import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "@/app/types/Player";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

interface Props {
  players: Player[];
}

const PlayersList: React.FC<Props> = ({ players }) => {
  const formatPhoneNumber = (phoneNum: string) => {
    return `972${phoneNum.substring(1)}`;
  };

  return (
    <div className="players flex flex-col items-start gap-2 pr-4">
      <div className="flex w-full flex-col space-y-1">
        {players.map((player, index) => (
          <div key={index} className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-full border-2 border-white">
                <AvatarImage src={player.image} alt={player.name} />
                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{player.name}</span>
            </div>
            <a
              href={`https://wa.me/${formatPhoneNumber(player.phoneNum)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-4"
            >
              <FaWhatsapp className="text-[#25D366]" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
