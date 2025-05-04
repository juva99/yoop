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

export type GameDetails = {
  gameType?: GameType;
  location?: string;
  startTime?: any;
  endTime?: any;
  maxParticipants: number;
  field?: any;
  date: Date;
};

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};
export const cities = [
  { label: "תל אביב", value: "תל אביב" },
  { label: "ירושלים", value: "jerusalem" },
  { label: "חיפה", value: "haifa" },
  { label: "באר שבע", value: "beer-sheva" },
  { label: "נתניה", value: "netanya" },
  { label: "אשדוד", value: "ashdod" },
  { label: "רמת גן", value: "ramat-gan" },
  { label: "פתח תקווה", value: "petah-tikva" },
  { label: "הרצליה", value: "herzliya" },
];

function getAvailableEndTimes(start: string, available: string[]): string[] {
  const format = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return new Date(0, 0, 0, h, m);
  };

  const sorted = available
    .map(format)
    .sort((a, b) => a.getTime() - b.getTime());

  const startTime = format(start);
  const endTimes: string[] = [];

  let current = startTime;
  while (true) {
    const next = new Date(current.getTime() + 30 * 60000);
    const nextStr = next.toTimeString().slice(0, 5);
    if (available.includes(nextStr)) {
      endTimes.push(nextStr);
      current = next;
    } else break;
  }

  return endTimes;
}

const CreateGame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [inputs, setInputs] = useState<GameDetails>({
    date: new Date(),
    maxParticipants: 10,
  });
  const [filedList, setFieldList] = useState<Option[]>([]);
  const [formFilled, setFormFilled] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slots, setSlots] = useState<Option[]>([]);
  const [endTimeOptions, setEndTimeOptions] = useState<Option[]>([]);
  const router = useRouter();

  useEffect(() => {
    const { endTime, ...rest } = inputs;
    setInputs(rest);
    if (!inputs.startTime || availableSlots.length === 0) {
      setEndTimeOptions([]);
      return;
    }

    const startIndex = availableSlots.indexOf(inputs.startTime);
    if (startIndex === -1) return;

    // נמצא את כל השעות הרצופות מהשעה שנבחרה
    const options: Option[] = [];
    for (let i = startIndex + 1; i < availableSlots.length; i++) {
      // אם לא רציף – עצור
      const prev = availableSlots[i - 1];
      const current = availableSlots[i];

      const [prevHour, prevMin] = prev.split(":").map(Number);
      const [currHour, currMin] = current.split(":").map(Number);
      const diff = currHour * 60 + currMin - (prevHour * 60 + prevMin);

      if (diff !== 30) break;

      options.push({
        label: availableSlots[i],
        value: availableSlots[i],
      });
    }

    setEndTimeOptions(options);
  }, [inputs.startTime, availableSlots]);

  useEffect(() => {
    if (inputs.location) {
      fetchFields();
    }
  }, [inputs.location]);

  useEffect(() => {
    console.log(inputs);
    if (
      inputs.date &&
      inputs.field != null &&
      inputs.endTime &&
      inputs.gameType &&
      inputs.location &&
      inputs.maxParticipants &&
      inputs.startTime
    ) {
      setFormFilled(true);
    }
    console.log(formFilled);
  }, [inputs]);

  useEffect(() => {
    if (inputs.field) {
      fetchAvailableSlots();
    }
  }, [inputs.field, inputs.date]);

  const onInputChange = (key: string, value: any) => {
    if (key === "startTime") {
      const endTimes = getAvailableEndTimes(value, availableSlots);
      setInputs({ ...inputs, startTime: value, endTime: undefined }); // אפס endTime
      setEndTimeOptions(endTimes.map((t) => ({ label: t, value: t })));
    } else {
      setInputs({ ...inputs, [key]: value });
    }
  };

  const fetchAvailableSlots = async () => {
    const date = new Date(inputs.date);
    console.log(date.toISOString());
    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
    console.log(date.toISOString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/available-slots/${inputs.field}/?date=${date.toISOString().split("T")[0]}`,
        { method: "GET" },
      );
      const data: string[] = await response.json();
      setAvailableSlots(data);
      const allSlots: Option[] = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2)
          .toString()
          .padStart(2, "0");
        const minute = i % 2 === 0 ? "00" : "30";
        const label = `${hour}:${minute}`;
        return {
          label,
          value: label,
          disabled: !availableSlots.includes(label), // תפוס = true
        };
      });
      setSlots(allSlots);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFields = async () => {
    try {
      const fieldsResponse = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/by-city?city=${inputs.location}`,
        { method: "GET" },
      );
      const fieldsData: { fieldId: string; fieldName: string }[] =
        await fieldsResponse.json();

      const dropdownOptions = fieldsData.map((field) => ({
        value: field.fieldId,
        label: field.fieldName,
      }));
      setFieldList(dropdownOptions);
    } catch (err) {
      setFieldList([]);
      setInputs({ ...inputs, field: null });
      console.error("שגיאה בטעינת מגרשים לעיר:", err);
    }
  };

  const submitHandler = async () => {
    if (!formFilled) {
      alert("חובה למלא את כל הפרטים");
      return;
    }

    setIsLoading(true);
    setJoinLink(null);

    // יצירת עותקים של תאריך
    const startDate = new Date(inputs.date);
    const endDate = new Date(inputs.date);

    // נניח שinputs.startTime = "10:30"
    const [startHour, startMinute] = inputs.startTime.split(":").map(Number);
    const [endHour, endMinute] = inputs.endTime.split(":").map(Number);

    startDate.setHours(startHour, startMinute, 0, 0);
    endDate.setHours(endHour, endMinute, 0, 0);

    try {
      const session = await getSession();
      const token = session?.accessToken;

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
            startDate,
            endDate,
            maxParticipants: inputs.maxParticipants,
            field: inputs.field,
          }),
        },
      );

      const result = await response.json();
      if (response.ok && result.gameId) {
        setJoinLink(`/game/${result.gameId}`);
        setInputs({ date: new Date(), maxParticipants: 10 });
      } else {
        alert("לא ניתן היה ליצור את המשחק. נסה שוב.");
      }
    } catch (err) {
      console.error("שגיאה בשליחה לשרת:", err);
      alert("אירעה שגיאה בשליחה לשרת.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-game p-5 text-black">
      <p className="mt-5 text-2xl font-medium text-blue-500">יצירת משחק</p>
      <DateFilter value={inputs.date} onFilterChange={onInputChange} />
      <TypeFilter onFilterChange={onInputChange} />
      <DropDownInput
        values={cities}
        placeholder="עיר"
        filterKey="location"
        onFilterChange={onInputChange}
      />
      <DropDownInput
        values={filedList}
        placeholder="מגרש"
        filterKey="field"
        onFilterChange={onInputChange}
      />
      <DropDownInput
        values={slots}
        placeholder="שעת התחלה"
        filterKey="startTime"
        onFilterChange={onInputChange}
      />
      <DropDownInput
        values={endTimeOptions}
        placeholder="שעת סיום"
        filterKey="endTime"
        onFilterChange={onInputChange}
      />
      <MaxParticipants onFilterChange={onInputChange} />
      {!joinLink && (
        <button
          onClick={() => {
            submitHandler();
          }}
          disabled={!formFilled || isLoading}
          className={`rounded-full px-10 py-4 text-lg tracking-wider shadow-lg ${
            formFilled && !isLoading
              ? "bg-green-400"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {isLoading ? "מחכה לאישור" : "הזמנת מגרש"}
        </button>
      )}

      {joinLink && (
        <button
          onClick={() => {
            if (joinLink) {
              router.push(joinLink);
            }
          }}
          disabled={!formFilled || isLoading}
          className={`rounded-full px-10 py-4 text-lg tracking-wider shadow-lg ${
            formFilled && !isLoading
              ? "bg-green-400"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          לעמוד המשחק
        </button>
      )}
    </div>
  );
};

export default CreateGame;
