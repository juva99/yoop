"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Combobox } from "../ui/combobox";
import { authFetch } from "@/lib/authFetch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TimeSlotStepProps {
  form: UseFormReturn;
}

function areConsecutive(time1: string, time2: string): boolean {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);
  const date1 = new Date(0, 0, 0, h1, m1);
  const date2 = new Date(0, 0, 0, h2, m2);
  return date2.getTime() - date1.getTime() === 30 * 60 * 1000;
}

function getConsecutiveEndTimes(start: string, available: string[]): string[] {
  if (!start || !available.includes(start)) return [];

  const sortedAvailable = [...available].sort();
  const startIndex = sortedAvailable.indexOf(start);
  if (startIndex === -1) return [];

  const endTimes: string[] = [];
  let currentIndex = startIndex;
  endTimes.push(sortedAvailable[startIndex]);

  while (currentIndex + 1 < sortedAvailable.length) {
    const currentSlot = sortedAvailable[currentIndex];
    const nextSlot = sortedAvailable[currentIndex + 1];

    if (areConsecutive(currentSlot, nextSlot)) {
      endTimes.push(nextSlot);
      currentIndex++;
    } else {
      break;
    }
  }
  return endTimes;
}

function add30Minutes(timeStr: string): string {
  if (timeStr === "23:30") return "24:00";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(0, 0, 0, hours, minutes);
  date.setMinutes(date.getMinutes() + 30);
  const newHours = date.getHours().toString().padStart(2, "0");
  const newMinutes = date.getMinutes().toString().padStart(2, "0");
  return `${newHours}:${newMinutes}`;
}

async function fetchAvailableSlots(
  field: string,
  date: Date,
): Promise<string[]> {
  const date_fixed = new Date(date);
  date_fixed.setHours(
    date_fixed.getHours() - date_fixed.getTimezoneOffset() / 60,
  );
  const dateString = date_fixed.toISOString().split("T")[0];

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/available-slots/${field}?date=${dateString}&timezone=${date_fixed.getTimezoneOffset() / -60}`,
    { method: "GET" },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch fields: ${response.statusText}`);
  }
  const data: string[] = await response.json();
  return data.sort();
}

export default function EndTimeStep({ form }: TimeSlotStepProps) {
  const field: string = form.watch("fieldName");
  const date: Date = form.watch("date");
  const startTime: string = form.watch("startTime");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableSlots(field, date)
      .then((slots) => {
        const endOptions = getConsecutiveEndTimes(startTime, slots).map((t) =>
          add30Minutes(t),
        );
        setAvailableSlots(endOptions);
      })
      .catch((error) => {
        console.error("Failed to fetch available slots:", error);
        setAvailableSlots([]);
      });
  }, [field, date, startTime]);

  return (
    <>
      {availableSlots.length > 0 ? (
        <FormField
          control={form.control}
          name="endTime"
          render={({ field: endTimeField }) => (
            <FormItem>
              <FormLabel>שעת סיום משחק</FormLabel>
              <FormControl>
                <Combobox
                  options={availableSlots.map((slot) => ({
                    value: slot,
                    label: slot,
                  }))}
                  value={endTimeField.value}
                  onSelect={endTimeField.onChange}
                  placeholder="בחר שעת סיום"
                  searchPlaceholder="חפש שעה..."
                  notFoundText="לא נמצאו שעות זמינות"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}
