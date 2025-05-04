"use client";
import React, { ReactNode, useState } from "react";
import { GoTriangleDown } from "react-icons/go";

type Option = {
  label: string;
  value: string;
  icon?: ReactNode;
};

type Props = {
  text: string; // placeholder
  icon: ReactNode;
  options: Option[];
  value: string;
  onChange: (value: any) => void;
};

const Filter: React.FC<Props> = ({ text, icon, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative inline-block w-fit text-right">
      {/* main button */}
      <div
        className="filter-wrapper flex cursor-pointer items-center gap-2 rounded-4xl border border-gray-300 pt-1 pr-3 pb-1 pl-3"
        onClick={() => setOpen(!open)}
      >
        <div className="filter-icon text-lg">{selected?.icon || icon}</div>
        <div className="filter-text">{selected?.label || text}</div>
        <GoTriangleDown color="gray" />
      </div>

      {/* dropdown menu */}
      {open && (
        <div className="absolute right-0 z-10 mt-2 min-w-full rounded-xl border bg-white shadow">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
