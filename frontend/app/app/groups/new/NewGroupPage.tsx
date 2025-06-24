import React from "react";
import { getMyFriends } from "@/lib/actions";
import GroupForm from "./GroupForm";

const Groups: React.FC = async () => {
  const friends = await getMyFriends();

  return (
    <div className="py-10">
      <h1 className="text-center">יצירת קבוצה חדשה</h1>
      <GroupForm friends={friends} newGroup={true} />
    </div>
  );
};

export default Groups;
