import React from "react";
import NewGroupForm, { Friend } from "./NewGroupForm";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { getMyFriends } from "@/lib/actions";
import { fetchFriendsFromRelations } from "@/lib/actions";

const Groups: React.FC = async () => {
  const friends = await getMyFriends();
  const session = await getSession();

  const friendsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/getAll`,
  );
  const friendRelations = await friendsResponse.json();
  const friends: Friend[] = await fetchFriendsFromRelations(
    friendRelations,
    session!.user.uid,
  );

  return (
    <div className="py-10">
      <h1>יצירת קבוצה חדשה</h1>
      <NewGroupForm friends={friends} />
      <NewGroupForm friends={friends} />
    </div>
  );
};

export default Groups;
