import { GameType } from "@/app/enums/game-type.enum";
import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";

type Props = {
  gameTypes: GameType[];
  groupName: string;
};

const GroupTitle: React.FC<Props> = ({ gameTypes, groupName }) => {
  return (
    <div className="text-title flex gap-2 font-bold">
      <span className="text-2xl"> {groupName}</span>

      <span className="flex items-center text-xl">
        {gameTypes.map((t, index) =>
          t === GameType.FootBall ? (
            <PiSoccerBall key={"icon" + index} />
          ) : (
            <PiBasketball key={"icon" + index} />
          ),
        )}
      </span>
    </div>
  );
};

export default GroupTitle;
