import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "@/app/types/Player";
import React from "react";

interface Props {
  players: Player[];
}

const AvatarGroup: React.FC<Props> = ({ players }) => {
  return (
    <div className="players mt-2 flex items-center justify-start gap-1">
      <div className="flex justify-start -space-x-3">
        {players.slice(0, 5).map((player, index) => (
          <Avatar
            key={index}
            className="h-8 w-8 rounded-full border-2 border-white"
          >
            <AvatarImage src={player.image} alt={player.name} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {players.length > 5 && (
            <span className="ml-2 text-sm font-medium">
              +{players.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarGroup;
