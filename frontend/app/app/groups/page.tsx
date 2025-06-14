import { Card } from "@/components/ui/card";

import React from "react";
import NewGroupBtn from "./NewGroupBtn";

const page: React.FC = () => {
  const groups = [];
  return (
    <div className="flex min-h-[100vh] flex-col gap-5 bg-[url('/search-friends-background.png')] bg-top bg-no-repeat p-5">
      <Card variant="friends" className="min-h-[200px]">
        <>
          <h1>הקבוצות שלי</h1>
          {!groups.length ? (
            <span className="text-center">אתה לא שייך לאף קבוצה</span>
          ) : (
            ""
          )}
          <NewGroupBtn />
        </>
      </Card>
    </div>
  );
};

export default page;
