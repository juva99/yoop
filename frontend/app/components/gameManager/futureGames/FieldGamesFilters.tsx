"use client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
type Props = {
  onFilterChange: (
    available: boolean,
    pending: boolean,
    finished: boolean,
  ) => void;
  availableCount: number;
  pendingCount: number;
  finishedCount: number;
};

const Filters: React.FC<Props> = ({
  onFilterChange,
  pendingCount,
  availableCount,
  finishedCount,
}) => {
  const [availableFilter, setAvailableFilter] = useState<boolean>(true);
  const [pendingFilter, setPendingFilter] = useState<boolean>(true);
  const [finishedFilter, setFinishedFilter] = useState<boolean>(false);

  useEffect(() => {
    onFilterChange(availableFilter, pendingFilter, finishedFilter);
  }, [availableFilter, pendingFilter, finishedFilter]);

  return (
    <div className="mb-5 flex gap-3 text-[12px]">
      <div className="flex items-center gap-1">
        <Checkbox
          id="check-available"
          checked={availableFilter}
          onCheckedChange={() => {
            setAvailableFilter(!availableFilter);
          }}
        />
        <label htmlFor="check-available"> זמין להרשמה ({availableCount})</label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="check-pending"
          checked={pendingFilter}
          onCheckedChange={() => {
            setPendingFilter(!pendingFilter);
          }}
        />
        <label htmlFor="check-pending"> ממתין לאישורך ({pendingCount})</label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="check-finidshed"
          checked={finishedFilter}
          onCheckedChange={() => {
            setFinishedFilter(!finishedFilter);
          }}
        />
        <label htmlFor="check-finidshed"> הסתיימו ({finishedCount})</label>
      </div>
    </div>
  );
};

export default Filters;
