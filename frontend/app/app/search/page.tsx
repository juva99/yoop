import Search from "@/components/searchComponents/search-games";
import React from "react";

const page: React.FC = () => {
  return (
    <div className="p-5">
      <h1>חיפוש משחק</h1>
      <Search />
    </div>
  );
};

export default page;
