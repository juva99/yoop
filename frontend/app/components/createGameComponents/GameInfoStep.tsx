"use client";

import { City } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DateTimePicker } from "../ui/datetime-picker";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface GameInfoStepProps {
  form: UseFormReturn;
}

const gameTypeOptions = Object.entries(GameType).map(([_, value]) => ({
  label: value,
  value: value,
}));

const cityOptions = Object.entries(City).map(([label, value]) => ({
  label: value,
  value: value,
}));

export default function GameInfoStep({ form }: GameInfoStepProps) {
  return (
    <>
      <h2 className="text-base leading-7 font-semibold text-gray-900">
        פרטי משחק
      </h2>

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>תאריך</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "flex w-[240px] justify-start pl-3 font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>בחר תאריך</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  locale={he}
                  disabled={(date) =>
                    date < new Date(new Date().toDateString()) ||
                    date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <Combobox
        form={form}
        name="gameType"
        label="סוג משחק"
        options={gameTypeOptions}
        placeholder="בחר סוג משחק"
        searchPlaceholder="חפש סוג משחק..."
        notFoundText="לא נמצא סוג משחק"
      />

      <Combobox
        form={form}
        name="city"
        label="עיר"
        options={cityOptions}
        placeholder="בחר עיר"
        searchPlaceholder="חפש עיר..."
        notFoundText="לא נמצאה עיר"
      />

      <FormField
        control={form.control}
        name="maxParticipants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>מקסימום משתתפים</FormLabel>
            <FormControl>
              <Input
                type="number"
                id="maxParticipants"
                placeholder="הזן מקסימום משתתפים"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string for clearing the input, otherwise parse as int
                  field.onChange(value === "" ? "" : parseInt(value, 10));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
