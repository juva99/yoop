"use client";
import React from "react";
import { Combobox } from "../ui/combobox";
import { Button } from "@/components/ui/button";
import { City } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const formSchema = z.object({
  city: z.string(),
  gameType: z.string().optional(),
  date: z.date().optional(),
  timeRange: z.array(z.number()).length(2).default([9, 22]),
});

type FormValues = z.infer<typeof formSchema>;

const cityOptions = Object.values(City).map((city) => ({
  label: city,
  value: city,
}));

const gameTypeOptions = Object.values(GameType).map((type) => ({
  label: type,
  value: type,
}));

const SearchGames = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      gameType: "",
      date: undefined,
      timeRange: [9, 22],
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form Submitted:", values);
    // Handle form submission logic
  };

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

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

        {/* <div className="search-game__filters mt-2 mb-2 flex gap-2">
          <DateFilter value={filters.date} onFilterChange={onFilterChange} />
          <TypeFilter onFilterChange={onFilterChange} />
        </div>
        <TimeSlider onFilterChange={onFilterChange} />
        <Button
          className="bg-title my-5 w-[100%]"
          onClick={() => {
            updateFilters(filters);
          }}
        >
          חפש
        </Button>
      </div>
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
      <FilteredGames games={filteredGames} /> */}
      </div>
    </div>
  );
};

export default SearchGames;
