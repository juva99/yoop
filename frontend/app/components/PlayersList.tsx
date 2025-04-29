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
    <div className="players mt-2 pr-4 flex flex-col items-start gap-2">
      <div className="flex flex-col space-y-1">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 rounded-full border-2 border-white">
              <AvatarImage src={player.image} alt={player.name} />
              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{player.name}</span>
            <a 
              href={`https://wa.me/${formatPhoneNumber(player.phoneNum)}`}              target="_blank"
              rel="noopener noreferrer"  
            >
              <FaWhatsapp className="text-[#25D366]"/>
            </a>
          </div>
        ))}
      </div>
    </div>
);
};

export default PlayersList;
