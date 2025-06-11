import { Card } from "@/components/ui/card";

import React from "react";
import NewGroupBtn from "./NewGroupBtn";

type Props = {
  // your props here
};

const page: React.FC<Props> = ({}) => {
  return (
    <div className="flex min-h-[100vh] flex-col gap-5 bg-[url('/search-friends-background.png')] bg-top bg-no-repeat p-5">
      <Card variant="friends">
        <>
          <h1>הקבוצות שלי</h1>
          <NewGroupBtn />
        </>
      </Card>
    </div>
  );
};

export default page;
