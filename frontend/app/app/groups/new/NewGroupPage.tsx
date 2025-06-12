import React from "react";
import NewGroupForm from "./NewGroupForm";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";

const Groups: React.FC = async () => {
  const session = await getSession();

  const friendsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/getAll`,
  );
  const friendRelations = await friendsResponse.json();

  return (
    <div className="py-10">
      <h1>יצירת קבוצה חדשה</h1>
      <NewGroupForm relations={friendRelations} userId={session!.user.uid} />
    </div>
  );
};

export default Groups;
