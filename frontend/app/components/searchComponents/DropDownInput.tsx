"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Option = {
  label: string;
  value: string;
  disabled?: boolean
};

type Props = {
  onFilterChange: (key: string, value: string) => void;
  values: Option[];
  filterKey: string; 
  placeholder?: string;
};

export function DropDownInput({ onFilterChange, filterKey, values, placeholder }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);

  const handleSelect = (value: string) => {
    const selected = values.find((v) => v.value === value);
    if (!selected) return;

    setSelectedOption(selected);
    onFilterChange(filterKey, selected.value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="flex w-[180px] text-black items-center justify-between gap-2 rounded-4xl border border-gray-300 pt-1 pr-3 pb-1 pl-3 text-right"
          onClick={() => setOpen(!open)}
        >
          {selectedOption ? selectedOption.label : `בחר ${placeholder ?? "אפשרות"}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 text-right">
        <Command>
        {!(filterKey === 'startTime' || filterKey === 'endTime') && (
  <CommandInput placeholder={`בחר ${placeholder ?? "אפשרות"}`} className="text-right" />
)}
          <CommandEmpty>אין תוצאות</CommandEmpty>
          <div className="max-h-60 overflow-y-auto">
  <CommandGroup>
    {values.map((option) => (
      <CommandItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        onSelect={() => {
          if (!option.disabled) handleSelect(option.value);
        }}
        className={cn(
          "cursor-pointer justify-end",
          option.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Check
          className={cn(
            "ml-2 h-4 w-4",
            selectedOption?.value === option.value ? "opacity-100" : "opacity-0"
          )}
        />
        {option.label}
      </CommandItem>
    ))}
  </CommandGroup>
</div>

        </Command>
      </PopoverContent>
    </Popover>
  );
}
