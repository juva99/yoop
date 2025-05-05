"use client";
import React, { useEffect, useState } from "react";
import DateFilter from "../searchComponents/DateFilter";
import TypeFilter from "../searchComponents/TypeFilter";
import { authFetch } from "@/lib/authFetch";
import { GameType } from "@/app/enums/game-type.enum";
import { DropDownInput } from "../searchComponents/DropDownInput";
import { getSession } from "@/lib/session";
import MaxParticipants from "./MaxParticipants";
import { useRouter } from "next/navigation";
import { City } from "@/app/enums/city.enum";

export type GameDetails = {
  gameType?: GameType;
  location?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants: number;
  field?: string;
  date: Date;
};

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

export const cities: Option[] = Object.entries(City).map(
  ([enumLabel, cityName]) => ({
    label: cityName,
    value: enumLabel,
  }),
);

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

const CreateGame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [inputs, setInputs] = useState<GameDetails>({
    date: new Date(),
    maxParticipants: 10,
    gameType: undefined,
    location: undefined,
    field: undefined,
    startTime: undefined,
    endTime: undefined,
  });
  const [fieldList, setFieldList] = useState<Option[]>([]);
  const [formFilled, setFormFilled] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [startTimeOptions, setStartTimeOptions] = useState<Option[]>([]);
  const [endTimeOptions, setEndTimeOptions] = useState<Option[]>([]);
  const router = useRouter();

  useEffect(() => {
    const isFilled = !!(
      inputs.date &&
      inputs.gameType &&
      inputs.location &&
      inputs.field &&
      inputs.startTime &&
      inputs.endTime &&
      inputs.maxParticipants >= 2
    );
    setFormFilled(isFilled);
  }, [inputs]);

  useEffect(() => {
    if (inputs.location) {
      fetchFields();
    } else {
      setFieldList([]);
      setInputs((prev) => ({
        ...prev,
        field: undefined,
        startTime: undefined,
        endTime: undefined,
      }));
      setAvailableSlots([]);
      setStartTimeOptions([]);
      setEndTimeOptions([]);
    }
  }, [inputs.location]);

  useEffect(() => {
    if (inputs.field && inputs.date) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setStartTimeOptions([]);
      setEndTimeOptions([]);
      setInputs((prev) => ({
        ...prev,
        startTime: undefined,
        endTime: undefined,
      }));
    }
  }, [inputs.field, inputs.date]);

  useEffect(() => {
    if (inputs.startTime && availableSlots.length > 0) {
      // consecutiveEndTimes contains the start times of the slots *after* the selected start time
      const consecutiveEndTimes = getConsecutiveEndTimes(
        inputs.startTime,
        availableSlots,
      );

      // Map these start times to the actual end time (30 mins later) for the dropdown options
      const newEndTimeOptions = consecutiveEndTimes.map((t) => {
        const actualEndTime = add30Minutes(t); // Calculate the time 30 mins after the start of the last slot
        return { label: actualEndTime, value: actualEndTime }; // Use the actual end time for both label and value
      });

      setEndTimeOptions(newEndTimeOptions);

      // Check if the currently selected endTime is still valid within the new options
      if (
        inputs.endTime &&
        !newEndTimeOptions.some((opt) => opt.value === inputs.endTime)
      ) {
        setInputs((prev) => ({ ...prev, endTime: undefined }));
      }
    } else {
      setEndTimeOptions([]);
      if (!inputs.startTime) {
        setInputs((prev) => ({ ...prev, endTime: undefined }));
      }
    }
  }, [inputs.startTime, availableSlots]);

  const onInputChange = (key: string, value: any) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs, [key]: value };

      if (key === "location") {
        newInputs.field = undefined;
        newInputs.startTime = undefined;
        newInputs.endTime = undefined;
        setFieldList([]);
        setAvailableSlots([]);
        setStartTimeOptions([]);
        setEndTimeOptions([]);
      } else if (key === "field" || key === "date") {
        newInputs.startTime = undefined;
        newInputs.endTime = undefined;
        setAvailableSlots([]);
        setStartTimeOptions([]);
        setEndTimeOptions([]);
      } else if (key === "startTime") {
        newInputs.endTime = undefined;
      }

      return newInputs;
    });
  };

  const fetchAvailableSlots = async () => {
    if (!inputs.field || !inputs.date) return;

    const date = new Date(inputs.date);
    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
    const dateString = date.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/available-slots/${inputs.field}?date=${dateString}&timezone=${date.getTimezoneOffset() / -60}`,
        { method: "GET" },
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch slots: ${response.statusText}`);
      }
      const data: string[] = await response.json();
      const sortedData = data.sort();
      setAvailableSlots(sortedData);
      setStartTimeOptions(
        sortedData.map((slot) => ({ label: slot, value: slot })),
      );
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableSlots([]);
      setStartTimeOptions([]);
      setEndTimeOptions([]);
    }
  };

  const fetchFields = async () => {
    if (!inputs.location) return;
    try {
      const fieldsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/by-city?city=${inputs.location}`,
        { method: "GET" },
      );
      if (!fieldsResponse.ok) {
        throw new Error(`Failed to fetch fields: ${fieldsResponse.statusText}`);
      }
      const fieldsData: { fieldId: string; fieldName: string }[] =
        await fieldsResponse.json();
      const dropdownOptions = fieldsData.map((field) => ({
        value: field.fieldId,
        label: field.fieldName,
      }));
      setFieldList(dropdownOptions);
    } catch (err) {
      console.error("Error fetching fields:", err);
      setFieldList([]);
      setInputs({
        ...inputs,
        field: undefined,
        startTime: undefined,
        endTime: undefined,
      });
      setAvailableSlots([]);
      setStartTimeOptions([]);
      setEndTimeOptions([]);
    }
  };

  const submitHandler = async () => {
    if (!formFilled) {
      alert("Please fill in all required fields.");
      return;
    }
    if (
      inputs.startTime &&
      inputs.endTime &&
      inputs.startTime >= inputs.endTime
    ) {
      alert("End time must be after start time.");
      return;
    }

    setIsLoading(true);
    setJoinLink(null);

    const baseDate = new Date(inputs.date);
    const [startHour, startMinute] = inputs.startTime!.split(":").map(Number);
    const [endHour, endMinute] = inputs.endTime!.split(":").map(Number);

    const startDate = new Date(baseDate);
    startDate.setHours(startHour);
    startDate.setMinutes(startMinute);
    const endDate = new Date(baseDate);
    endDate.setHours(endHour);
    endDate.setMinutes(endMinute);

    try {
      const session = await getSession();
      const token = session?.accessToken;
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gameType: inputs.gameType,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            maxParticipants: inputs.maxParticipants,
            field: inputs.field,
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.gameId) {
        setJoinLink(`/game/${result.gameId}`);
        setInputs({
          date: new Date(),
          maxParticipants: 10,
          gameType: undefined,
          location: undefined,
          field: undefined,
          startTime: undefined,
          endTime: undefined,
        });
        setFieldList([]);
        setAvailableSlots([]);
        setStartTimeOptions([]);
        setEndTimeOptions([]);
        setFormFilled(false);
      } else {
        const errorMsg =
          result.message || "Could not create the game. Please try again.";
        alert(`Error: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Error submitting game:", err);
      alert(
        `An error occurred: ${err.message || "Please check your connection and try again."}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-game flex flex-col gap-4 p-5 text-black">
      <p className="mt-5 text-2xl font-medium text-blue-500">Create Game</p>

      <div className="flex flex-wrap gap-4">
        <DateFilter value={inputs.date} onFilterChange={onInputChange} />
        <TypeFilter onFilterChange={onInputChange} />
        <DropDownInput
          values={cities}
          placeholder="City"
          filterKey="location"
          onFilterChange={onInputChange}
        />
      </div>

      {inputs.location && (
        <DropDownInput
          values={fieldList}
          placeholder="Field"
          filterKey="field"
          onFilterChange={onInputChange}
        />
      )}

      {inputs.field && inputs.date && (
        <div className="flex flex-wrap gap-4">
          <DropDownInput
            values={startTimeOptions}
            placeholder="Start Time"
            filterKey="startTime"
            onFilterChange={onInputChange}
          />
          <DropDownInput
            values={endTimeOptions}
            placeholder="End Time"
            filterKey="endTime"
            onFilterChange={onInputChange}
          />
        </div>
      )}

      <MaxParticipants onFilterChange={onInputChange} />

      {!joinLink && (
        <button
          onClick={submitHandler}
          disabled={!formFilled || isLoading}
          className={`mt-4 w-full rounded-full px-10 py-4 text-lg tracking-wider shadow-lg transition-colors duration-200 ${
            formFilled && !isLoading
              ? "bg-green-500 text-white hover:bg-green-600"
              : "cursor-not-allowed bg-gray-400 text-gray-700"
          }`}
        >
          {isLoading ? "Creating Game..." : "Create Game"}
        </button>
      )}

      {joinLink && (
        <button
          onClick={() => {
            if (joinLink) {
              router.push(joinLink);
            }
          }}
          className="mt-4 w-full rounded-full bg-blue-500 px-10 py-4 text-lg tracking-wider text-white shadow-lg transition-colors duration-200 hover:bg-blue-600"
        >
          Go to Game Page
        </button>
      )}
    </div>
  );
};

export default CreateGame;
