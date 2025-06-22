import React from "react";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { fetchFriendsFromRelations } from "@/lib/actions";
import { redirect } from "next/navigation";
import NewGroupForm, { Friend } from "../../new/NewGroupForm";
import { Group } from "@/app/types/Group";

type Props = {
  params: {
    group_id: string;
  };
};

const EditGroupPage: React.FC<Props> = async ({ params }) => {
  const session = await getSession();
  const groupId = params.group_id || undefined;

  const groupResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}`,
    {
      method: "GET",
    },
  );
  if (!groupResponse.ok) {
    redirect("/groups");
  }
  const group: Group = await groupResponse.json();

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
      <h1>עריכת קבוצה</h1>
      <NewGroupForm
        friends={friends}
        groupId={groupId}
        groupValues={{
          groupName: group.groupName,
          gameTypes: group.gameTypes,
          userIds: group.groupMembers.map((member) => member.user.uid),
        }}
      />
    </div>
  );
};

export default EditGroupPage;
