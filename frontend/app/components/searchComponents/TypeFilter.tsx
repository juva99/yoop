import React, { useState } from "react";

import Filter from "@/components/Filter";
import { PiSoccerBall } from "react-icons/pi";
import { PiBasketball } from "react-icons/pi";
type Props = {
  onFilterChange: (key: string, value: any) => void;
};

const typeOptions = [
  { label: "כדורסל", value: "basketball", icon: <PiBasketball /> },
  { label: "כדורגל", value: "soccer", icon: <PiSoccerBall /> },
];

const TypeFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [type, setType] = useState<string>("");

  const typeHandler = (type: string) => {
    setType(type);
    onFilterChange("type", type);
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
