"use client";

import FilteredGames from "@/components/searchComponents/FilteredGames";
import CreateGame from "@/components/createGameComponents/CreateGame";
import React, { useEffect, useState } from "react";
import { Game } from "../../types/Game";

// Props type for future use
type Props = {};

// Filters state type
type Filters = {
  type?: any;
  date?: any;
  time?: any;
  location?: any;
  radius?: any;
};

const page: React.FC<Props> = () => {
  // State to store selected filters
  const [filters, setFilters] = useState<Filters>({
    date: null as Date | null,
    type: null,
    time: null,
    location: "tel-aviv",
    radius: 10,
  });

  // Called from CreateGame component when filters change
  const filtersHandler = (filters: Filters) => {
    setFilters(filters);
    // In the future: fetch games based on filters here
  };

  return (
    <div
      className="min-h-screen overflow-hidden bg-cover bg-bottom bg-no-repeat text-white"
      style={{ backgroundImage: "url('/bg-full-waves.png')" }} // ✅ Make sure the image exists in /public
    >
      <div className="relative z-10 p-5">
        <CreateGame updateFilters={filtersHandler} />
      </div>
    </div>
  );
};

export default page;
