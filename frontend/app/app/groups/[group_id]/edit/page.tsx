import React from "react";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { getMyFriends } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Group } from "@/app/types/Group";
import { User } from "@/app/types/User";
import GroupForm from "../../new/GroupForm";

type Props = {
  params: {
    group_id: string;
  };
};

const EditGroupPage: React.FC<Props> = async ({ params }) => {
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
  const friends: User[] = await getMyFriends();

  return (
    <div className="py-10">
      <h1 className="text-center">עריכת קבוצה</h1>
      <GroupForm
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
