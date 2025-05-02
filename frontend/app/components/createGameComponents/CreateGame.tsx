"use client";
import React, { useState } from "react";
import TimeSlider from "./TimeSlider";
import DateFilter from "./DateFilter";
import TypeFilter from "./TypeFilter";
import MapView from "../MapView"; // Ensure the path and component name are correct
import GetWeather from "./GetWeather";

type Filters = {
  type: string | null;
  date: Date | null;
  time: { hour: number; minute: number } | null;
  location: string;
  radius: number;
};

const CreateGame: React.FC<{ updateFilters: (filters: Filters) => void }> = ({ updateFilters }) => {
  const [filters, setFilters] = useState<Filters>({
    date: null,
    type: null,
    time: null,
    location: "tel-aviv",
    radius: 5,
  });

  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([32.0853, 34.7818]);
  const [searchedMarker, setSearchedMarker] = useState<[number, number] | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [joinLink, setJoinLink] = useState<string | null>(null);

  const onFilterChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    updateFilters(updated);
  };

  const handleAddressSearch = async () => {
    if (address.length < 3) {
      setError("יש להכניס לפחות 3 אותיות");
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data?.length) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const displayName = data[0].display_name || address;

        setMapCenter([lat, lon]);
        setSearchedMarker([lat, lon]);
        setAddress("");
        setError("");

        onFilterChange("location", displayName);
      } else {
        setError("לא נמצאה כתובת מתאימה");
      }
    } catch (err) {
      console.error("שגיאה בחיפוש כתובת:", err);
      setError("שגיאה בחיפוש כתובת");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddressSearch();
    }
  };

  const isFormFilled = () => {
    return (
      filters.date &&
      filters.type &&
      filters.time &&
      (searchedMarker || filters.location === "tel-aviv")
    );
  };

  const handleSubmit = async () => {
    if (!isFormFilled()) {
      alert("חובה למלא את כל הפרטים");
      return;
    }

    setIsLoading(true);
    setJoinLink(null);

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...filters,
          lat: searchedMarker ? searchedMarker[0] : 32.0853,
          lon: searchedMarker ? searchedMarker[1] : 34.7818,
        }),
      });

      const result = await response.json();

      if (response.ok && result.id) {
        setJoinLink(`/joinGame?id=${result.id}`);
        setFilters({ date: null, type: null, time: null, location: "tel-aviv", radius: 5 });
        setSearchedMarker(null);
        setMapCenter([32.0853, 34.7818]);
        setAddress("");
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
      <p className="text-subtitle mt-5 text-2xl font-medium">יצירת משחק</p>

      <div className="mt-2 mb-2 flex gap-2 text-white">
        <DateFilter value={filters.date} onFilterChange={onFilterChange} />
        <TypeFilter onFilterChange={onFilterChange} />
      </div>

      <TimeSlider onFilterChange={onFilterChange} />

      <div className="my-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="חפש כתובת  ..."
          className="w-full p-2 border rounded-md"
        />
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

        {/* <div className="relative mt-6">
          <MapView/>
        </div> */}

        {searchedMarker && (
          <div className="mt-3">
            <GetWeather lat={searchedMarker[0]} lon={searchedMarker[1]} />
          </div>
        )}

        {joinLink && (
          <div className="mt-4 text-center">
            <a
              href={joinLink}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-lg text-lg"
            >
              לצפייה במשחק
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={!isFormFilled() || isLoading}
          className={`px-10 py-4 rounded-full shadow-lg text-lg tracking-wider ${
            isFormFilled() && !isLoading
              ? "bg-gray-900 text-white"
              : "bg-gray-400 text-gray-100 cursor-not-allowed"
          }`}
        >
          {isLoading ? "שולח..." : "הזמנת מגרש"}
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
