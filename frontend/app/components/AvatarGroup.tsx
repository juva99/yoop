import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/app/types/User";
import React from "react";

interface Props {
  players: User[];
}

const AvatarGroup: React.FC<Props> = ({ players }) => {
  return (
    <div className="players mt-2 flex items-center justify-start gap-1">
      <div className="flex justify-start -space-x-3">
        {players.slice(0, 5).map((player, index) => (
          <Avatar
            key={index}
            className="h-7 w-7 rounded-full border-2 border-white"
          >
            <AvatarImage src={player.profilePic} alt={player.firstName} />
            <AvatarFallback>
              {player.firstName.charAt(0)}
              {player.lastName.charAt(0)}
            </AvatarFallback>
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
