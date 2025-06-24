import { Group } from "@/app/types/Group";
import GroupMembers from "@/components/groups/GroupMembers";
import GroupTitle from "@/components/groups/GroupTypes";
import Link from "next/link";
import LeaveButton from "@/components/groups/LeaveButton";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { FiEdit } from "react-icons/fi";

import React from "react";

type Props = {
  params: Promise<{
    group_id: string;
  }>;
};

const page: React.FC<Props> = async ({ params }) => {
  const session = await getSession();
  const user_id = session!.user.uid;
  const { group_id } = await params;

  const groupResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${group_id}`,
    {
      method: "GET",
    },
  );
  if (!groupResponse.ok) {
    redirect("/groups");
  }

  const group: Group = await groupResponse.json();
  const isMember: boolean = group.groupMembers.some(
    (member) => member.user.uid === user_id,
  );
  const isManager: boolean = group.groupMembers.some(
    (member) => member.user.uid === user_id && member.isManager,
  );

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col gap-4 p-5">
      <div className="flex w-full items-center justify-between">
        <GroupTitle gameTypes={group.gameTypes} groupName={group.groupName} />{" "}
        {isManager && (
          <Link href={`/groups/${group_id}/edit`}>
            <FiEdit size={20} color="gray" />
          </Link>
        )}
      </div>
      <GroupMembers userId={user_id} group={group} isManager={isManager} />
      {isMember && group.groupMembers.length > 1 && (
        <LeaveButton userId={user_id} groupId={group_id} />
      )}
    </div>
  );
};

export default page;
