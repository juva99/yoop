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
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    redirect("/auth/login");
  }

const cities = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "נתניה",
  "אשדוד",
  "רמת גן",
  "פתח תקווה",
  "הרצליה",
];

type Props = {
  onFilterChange: (key: string, value: string) => void;
};

export function CityFilter({ onFilterChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState("");

  const handleSelect = (city: string) => {
    setSelectedCity(city);
    onFilterChange('location', city);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[130px] justify-between text-right flex items-center gap-2 rounded-4xl border border-gray-300 pt-1 pr-3 pb-1 pl-3"
          onClick={() => setOpen(!open)}
        >
          {selectedCity ? selectedCity : "בחר עיר"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0 text-right">
        <Command>
          <CommandInput placeholder="חפש עיר..." className="text-right" />
          <CommandEmpty>לא נמצאו ערים</CommandEmpty>
          <CommandGroup>
            {cities.map((city) => (
              <CommandItem
                key={city}
                value={city}
                onSelect={() => handleSelect(city)}
                className="cursor-pointer justify-end"
              >
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    selectedCity === city ? "opacity-100" : "opacity-0"
                  )}
                />
                {city}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
