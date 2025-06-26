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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <GroupTitle
                gameTypes={group.gameTypes}
                groupName={group.groupName}
              />
              <p className="mt-2 text-sm text-gray-600">
                {group.groupMembers.length} חברים בקבוצה
              </p>
            </div>
            {isManager && (
              <Link
                href={`/groups/${group_id}/edit`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
              >
                <FiEdit size={20} className="text-gray-600" />
              </Link>
            )}
          </div>
        </div>

        {/* Members Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            חברי הקבוצה
          </h2>
          <GroupMembers userId={user_id} group={group} isManager={isManager} />
        </div>

        {/* Leave Group Action */}
        {isMember && group.groupMembers.length > 1 && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex justify-center">
              <LeaveButton userId={user_id} groupId={group_id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
