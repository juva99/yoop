import { Card } from "@/components/ui/card";

import React from "react";
import NewGroupBtn from "./NewGroupBtn";

import Groups from "./Groups";

const page: React.FC = () => {
  const groups = [];
  return (
    <div className="flex flex-col gap-5 px-3">
      <Groups />
      <NewGroupBtn />
    </div>
  );
};

export default page;
