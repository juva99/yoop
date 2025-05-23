"use client";
import React, { useState, useEffect } from "react";
import { Combobox } from "../ui/combobox";
import { Button } from "@/components/ui/button";
import { City, cityCoordinates } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Slider } from "../ui/slider";
import {
  formDefaultValues,
  FormSchema,
  formSchema,
} from "@/lib/schemas/searchForm";
import FilteredGames from "./filtered-games";
import MapView from "../MapView";
import { Game } from "@/app/types/Game";
import { authFetch } from "@/lib/authFetch";

const cityOptions = Object.values(City).map((city) => ({
  label: city,
  value: city,
}));

const gameTypeOptions = Object.values(GameType).map((type) => ({
  label: type,
  value: type,
}));

const getDateWithTime = (baseDate: Date, hourDecimal: number): Date => {
  const date = new Date(baseDate);
  const hours = Math.floor(hourDecimal);
  const minutes = Math.round((hourDecimal - hours) * 60);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const SearchGames = () => {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const selectedCity = useWatch({
    control: form.control,
    name: "city",
  });

  const onSubmit = async (values: FormSchema) => {
    console.log("Form Submitted:", values);

    // Handle form submission logic - fetch games based on search criteria
    try {
      const params = new URLSearchParams();
      values.date.setHours(10);
      const startDate = getDateWithTime(values.date, values.timeRange[0]);
      const endDate = getDateWithTime(values.date, values.timeRange[1]);

      if (values.city) params.set("city", values.city);
      if (values.gameType) params.set("gameType", values.gameType);
      if (values.timeRange) {
        params.set("startDate", startDate.toISOString());
        params.set("endDate", endDate.toISOString());
      }

      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/query?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setFilteredGames(data);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
      setFilteredGames([]);
    }
  };

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const coords =
    selectedCity && cityCoordinates[selectedCity as City]
      ? cityCoordinates[selectedCity as City]
      : [31.78, 35.21]; // Default to center of Israel

  return (
    <div className="p-5">
      <div className="search-game">
        <p className="search-game__title text-subtitle mt-5 text-2xl font-medium">
          חיפוש משחק
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>עיר</FormLabel>
                    <FormControl>
                      <Combobox
                        options={cityOptions}
                        value={field.value}
                        onSelect={field.onChange}
                        placeholder="בחר עיר..."
                        searchPlaceholder="חפש עיר..."
                        notFoundText="לא נמצאה עיר."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gameType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סוג משחק</FormLabel>
                    <FormControl>
                      <Combobox
                        options={gameTypeOptions}
                        value={field.value}
                        onSelect={field.onChange}
                        placeholder="בחר סוג משחק..."
                        searchPlaceholder="חפש סוג משחק..."
                        notFoundText="לא נמצא סוג משחק."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                            "flex w-full justify-start pl-3 font-normal",
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

            <FormField
              control={form.control}
              name="timeRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    טווח שעות:{" "}
                    {field.value ? formatTime(field.value[0]) : "00:00"} -{" "}
                    {field.value ? formatTime(field.value[1]) : "00:00"}
                  </FormLabel>
                  <FormControl>
                    <div className="px-3">
                      <Slider
                        min={0}
                        max={24}
                        step={0.5}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="w-full"
                      />
                      <div className="mt-1 flex justify-between text-sm text-gray-500">
                        <span>00:00</span>
                        <span>24:00</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-title my-5 w-[100%]">
              חפש
            </Button>
          </form>
        </Form>

        {filteredGames.length ? (
          <MapView
            defaultLocation={{
              lat: coords[0],
              lng: coords[1],
            }}
            games={filteredGames}
          />
        ) : (
          ""
        )}
        <FilteredGames games={filteredGames} />
      </div>
    </div>
  );
};

export default SearchGames;
