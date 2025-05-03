"use client";
import React, { useState } from "react";
import DateFilter from "./DateFilter";
import TypeFilter from "./TypeFilter";
import GetWeather from "./GetWeather";
import { authFetch } from "@/lib/authFetch";
import { Field } from "@/app/types/Field";

type Filters = {
  type: string | null;
  date: Date | null;
  time: { hour: number; minute: number } | null;
  location: string;
  radius: number;
};

const CreateGame: React.FC<{ updateFilters: (filters: Filters) => void }> = ({
  updateFilters,
}) => {
  const [filters, setFilters] = useState<Filters>({
    date: null,
    type: null,
    time: null,
    location: "tel-aviv",
    radius: 5,
  });

  const [address, setAddress] = useState("");
  const [searchedMarker, setSearchedMarker] = useState<[number, number] | null>(
    null,
  );
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [maxParticipants, setMaxParticipants] = useState<number>(10);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);

  const onFilterChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    updateFilters(updated);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && address.length >= 3) {
      e.preventDefault();
      setError("");

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1&countrycodes=IL`,
        );
        const data = await res.json();

        if (data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          setSearchedMarker([lat, lon]);

          try {
            const fieldsResponse = await authFetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/by-city?city=${encodeURIComponent(address)}`,
              { method: "GET" },
            );
            const fieldsData = await fieldsResponse.json();
            setFields(fieldsData);
          } catch (err) {
            console.error("שגיאה בטעינת מגרשים לעיר:", err);
            setError("לא ניתן לטעון מגרשים לעיר זו");
          }
        } else {
          console.warn("לא נמצאה תוצאה מתאימה");
          setError("לא נמצאה תוצאה מתאימה לעיר שהוזנה");
        }
      } catch (err) {
        console.error("שגיאה בשליפת מיקום מה־API:", err);
        setError("שגיאה בחיבור ל־API");
      }
    }
  };

  const isFormFilled = () => {
    console.log("isFormFilled", {
      filters,
      selectedFieldId,
      maxParticipants,
    });
    return (
      filters.date &&
      filters.type &&
      filters.time &&
      filters.location &&
      selectedFieldId &&
      maxParticipants > 1
    );
  };

  const handleSubmit = async () => {
    if (!isFormFilled()) {
      alert("חובה למלא את כל הפרטים");
      return;
    }

    setIsLoading(true);
    setJoinLink(null);

    const date = filters.date!;
    const time = filters.time!;
    const startDate = new Date(date);
    startDate.setHours(time.hour);
    startDate.setMinutes(time.minute);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameType: filters.type,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          maxParticipants,
          field: selectedFieldId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.id) {
        setJoinLink(`/joinGame?id=${result.id}`);
        setFilters({
          date: null,
          type: null,
          time: null,
          location: "tel-aviv",
          radius: 5,
        });
        setSearchedMarker(null);
        setAddress("");
        setSelectedFieldId(null);
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
    <div className="search-game p-5">
      <p className="mt-5 text-2xl font-medium text-blue-500">יצירת משחק</p>

      <div className="mt-2 mb-2 flex gap-2 text-white">
        <DateFilter value={filters.date} onFilterChange={onFilterChange} />
        <TypeFilter onFilterChange={onFilterChange} />
      </div>

      <div className="my-4 flex flex-col justify-center gap-4">
        <div>
          <label className="text-white">בחר עיר:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="הכנס עיר ולחץ אנטר"
            className="w-[300px] rounded-md border p-2"
          />
        </div>

        {error && (
          <div className="text-sm font-medium text-red-500">{error}</div>
        )}

        {fields && (
          <select
            className="w-[300px] rounded-md border p-2"
            value={selectedFieldId || ""}
            onChange={(e) => setSelectedFieldId(e.target.value)}
          >
            <option value="">בחר מגרש</option>
            {fields.map((field) => (
              <option key={field.fieldId} value={field.fieldId}>
                {field.fieldName}
              </option>
            ))}
          </select>
        )}

        <label className="text-white">מספר משתתפים:</label>
        <input
          type="number"
          min={2}
          max={50}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.target.value))}
          className="w-[150px] rounded-md border p-2"
        />
        {searchedMarker && (
          <>
            <GetWeather lat={searchedMarker[0]} lon={searchedMarker[1]} />
          </>
        )}

        {joinLink && (
          <div className="mt-4 text-center">
            <a
              href={joinLink}
              className="rounded-full bg-green-600 px-6 py-2 text-lg text-white shadow-lg hover:bg-green-700"
            >
              לצפייה במשחק
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!isFormFilled() || isLoading}
          className={`rounded-full px-10 py-4 text-lg tracking-wider shadow-lg ${
            isFormFilled() && !isLoading
              ? "bg-gray-900 text-white"
              : "cursor-not-allowed bg-gray-400 text-gray-100"
          }`}
        >
          {isLoading ? "שולח..." : "הזמנת מגרש"}
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
