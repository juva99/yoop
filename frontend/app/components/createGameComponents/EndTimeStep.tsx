"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Combobox } from "../ui/combobox";
import { authFetch } from "@/lib/authFetch";

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
  console.log("Fetching available slots for field:", field, "on date:", date);
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
      <h2 className="text-base leading-7 font-semibold text-gray-900">
        Time Slot
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Set the end time for the game.
      </p>
      {availableSlots.length > 0 ? (
        <Combobox
          form={form}
          name="endTime"
          label="שעת סיום משחק"
          options={availableSlots.map((slot) => ({
            value: slot,
            label: slot,
          }))}
          placeholder="בחר שעת סיום"
          searchPlaceholder="חפש שעה..."
          notFoundText="בחר שעת סיום"
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}
