import Search from "@/components/searchComponents/search-games";
import React from "react";

type Props = {};

const page: React.FC<Props> = () => {
  return (
    <div className="p-5">
      <Search />
    </div>
  );
};

export default page;
