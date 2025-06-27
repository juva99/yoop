"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Combobox as ComboboxRoot } from "./combobox/combobox";
import { ComboboxInput } from "./combobox/combobox-input";
import { ComboboxContent } from "./combobox/combobox-content";
import { ComboboxItem } from "./combobox/combobox-item";
import { ComboboxEmpty } from "./combobox/combobox-empty";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value?: string;
  onSelect?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
  containerClassName?: string;
  disabled?: boolean;
  name?: string;
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  notFoundText = "No option found.",
  containerClassName,
  disabled = false,
  name,
}: ComboboxProps) {
  const handleClear = () => {
    onSelect?.("");
  };

  return (
    <div className={cn("w-full", containerClassName)}>
      <ComboboxRoot
        value={value || null}
        onValueChange={(newValue) => onSelect?.(newValue || "")}
      >
        <div className="relative">
          <ComboboxInput
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            className="cursor-pointer pr-16 text-right"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 hover:bg-gray-100"
              disabled={disabled}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <ComboboxContent>
          {options.map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              label={option.label}
              className="w-full justify-end text-right"
            />
          ))}
          <ComboboxEmpty className="text-right">{notFoundText}</ComboboxEmpty>
        </ComboboxContent>
      </ComboboxRoot>
    </div>
  );
}
