import React from "react";
import NewGroupForm from "./NewGroupForm";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { getMyFriends } from "@/lib/actions";

const Groups: React.FC = async () => {
  const friends = await getMyFriends();
  return (
    <div className="py-10">
      <h1>יצירת קבוצה חדשה</h1>
      <NewGroupForm friends={friends} />
    </div>
  );
};

export default Groups;
