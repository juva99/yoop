"use client";

import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Combobox } from "../ui/combobox";
import { authFetch } from "@/lib/authFetch";

interface TimeSlotStepProps {
  form: UseFormReturn;
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

export default function StartTimeStep({ form }: TimeSlotStepProps) {
  const field: string = form.watch("fieldName");
  const date: Date = form.watch("date");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableSlots(field, date)
      .then((slots) => {
        setAvailableSlots(slots);
      })
      .catch((error) => {
        console.error("Failed to fetch available slots:", error);
        setAvailableSlots([]);
      });
  }, [field, date]);

  return (
    <>
      {availableSlots.length > 0 ? (
        <Combobox
          form={form}
          name="startTime"
          label="שעת תחילת משחק"
          options={availableSlots.map((slot) => ({
            value: slot,
            label: slot,
          }))}
          placeholder="בחר שעת התחלה"
          searchPlaceholder="חפש שעה..."
          notFoundText="בחר שעת התחלה"
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}
