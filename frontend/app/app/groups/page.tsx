import { Card } from "@/components/ui/card";

import React from "react";
import NewGroupBtn from "./NewGroupBtn";

import Groups from "./Groups";

const page: React.FC = () => {
  const groups = [];
  return (
    <div className="flex min-h-[100vh] flex-col gap-5">
      <Card variant="friends" className="min-h-[200px] space-y-4">
        <>
          <Groups />
          <NewGroupBtn />
        </>
      </Card>
    </div>
  );
};

export default page;
