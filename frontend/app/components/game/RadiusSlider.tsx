import React from "react";
import { Slider } from "primereact/slider";
import { useState } from "react";

type Props = {
  // your props here
};

const RadiusSlider: React.FC<Props> = ({}) => {
  const [radius, setRadius] = useState<number>(5);

  return (
    <div>
      <p className="game-time__label m-2">
        עד <b>{radius}</b> ק״מ ממני או{" "}
      </p>
      <Slider
        value={radius}
        onChange={(e) => setRadius(e.value as number)}
        min={0}
        max={30}
        step={1}
        style={{ marginBottom: "15px" }}
      />
    </div>
  );
};

export default RadiusSlider;
