import React from "react";
import { Slider } from "primereact/slider";
import { useState } from "react";

type Props = {
  onFilterChange: (key: string, value: any) => void;
};

const RadiusSlider: React.FC<Props> = ({ onFilterChange }) => {
  const [radius, setRadius] = useState<number>(5);
  const onRadiusChange = (radius: number) => {
    setRadius(radius);
    onFilterChange("radius", radius);
  };
  return (
    <div>
      <p className="game-time__label m-2">
        עד <b>{radius}</b> ק״מ ממני{" "}
      </p>
      <Slider
        value={radius}
        onChange={(e) => onRadiusChange(e.value as number)}
        min={0}
        max={30}
        step={1}
        style={{ marginBottom: "15px" }}
      />
    </div>
  );
};

export default RadiusSlider;
