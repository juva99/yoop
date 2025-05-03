import React, { useState } from "react";
import { GameType } from "@/app/enums/game-type.enum";

import Filter from "@/components/Filter";
import { PiSoccerBall } from "react-icons/pi";
import { PiBasketball } from "react-icons/pi";
type Props = {
  onFilterChange: (key: string, value: any) => void;
};

const typeOptions = [
  { label: "כדורסל", value: GameType.BasketBall, icon: <PiBasketball /> },
  { label: "כדורגל", value: GameType.FootBall, icon: <PiSoccerBall /> },
];

const TypeFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [type, setType] = useState<GameType | "">("");

  const typeHandler = (type: GameType) => {
    setType(type);
    onFilterChange("gameType", type);
  };

  return (
    <div>
      {" "}
      <Filter
        text="איזה משחק?"
        icon={<></>}
        options={typeOptions}
        value={type}
        onChange={(newType) => {
          typeHandler(newType);
        }}
      />
    </div>
  );
};

export default TypeFilter;
