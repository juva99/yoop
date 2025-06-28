"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "./scroll-area";

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
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("flex flex-col", containerClassName)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-right"
            disabled={disabled}
            name={name}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-20 w-auto p-0"
          align="start"
          sideOffset={5}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-48">
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    className="flex justify-end text-right"
                    key={option.value}
                    onSelect={() => {
                      onSelect?.(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
