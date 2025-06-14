import { Card } from "@/components/ui/card";

import React from "react";
import NewGroupBtn from "./NewGroupBtn";

import Groups from "./Groups";

const page: React.FC = () => {
  const groups = [];
  return (
    <div className="flex min-h-[100vh] flex-col gap-5 p-3">
      <Groups />
      <NewGroupBtn />
    </div>
  );
};

export default page;
