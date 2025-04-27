import React, { useEffect } from "react";

import { Slider } from "primereact/slider";
import { useState } from "react";
type Props = {
  onFilterChange: (key: string, value: any) => void;
};

const formatTime = (value: number): string => {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${hours}:${paddedMinutes}`;
};

const TimeSlider: React.FC<Props> = ({ onFilterChange }) => {
  const [timeRange, setTimeRange] = useState<[number, number]>([8, 22]);

  useEffect(() => {
    onFilterChange("time", timeRange);
  }, [timeRange]);

  return (
    <div>
      <p className="game-time__label m-2">
        שעת משחק: בין {formatTime(timeRange[0])} ל {formatTime(timeRange[1])}
      </p>
      <Slider
        value={timeRange}
        onChange={(e) => setTimeRange(e.value as [number, number])}
        range
        min={0}
        max={24}
        step={0.25}
        style={{}}
      />
    </div>
  );
};

export default TimeSlider;
