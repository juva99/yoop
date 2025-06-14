import React from "react";
import { Group } from "../types/Group";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { TiDelete } from "react-icons/ti";

import { GameType } from "../enums/game-type.enum";
import AlertPopup from "@/components/AlertPopup";

type Props = {
  group: Group;
};

const GroupItem: React.FC<Props> = ({ group }) => {
  const deleteHandler = () => {
    console.log("deleted");
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-title flex items-center gap-2 text-lg font-bold">
          {group.gameTypes.map((t, index) =>
            t === GameType.BasketBall ? (
              <PiSoccerBall key={"icon" + index} />
            ) : (
              <PiBasketball key={"icon" + index} />
            ),
          )}
          {group.groupName}
        </p>
      </div>
      <div>
        <AlertPopup
          message={`בחרת לצאת מ${group.groupName}`}
          onClick={deleteHandler}
        >
          <TiDelete size={20} />
        </AlertPopup>
      </div>
    </div>
  );
};

export default GroupItem;
