"use client";
import React from "react";
import Friend from "../friends/Friend";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { Group } from "@/app/types/Group";
import { User } from "@/app/types/User";
import { useRouter } from "next/navigation";
import AddFriendsDialog from "./AddFriendsDialog";

type Props = {
  userId: string;
  group: Group;
  isManager: boolean;
};

async function removeHandler(
  user: User,
  groupId: string,
  router: ReturnType<typeof useRouter>,
) {
  try {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/remove/${user.uid}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data?.message || "שגיאה ביציאה מהקבוצה";
      toast.error(message);
    } else {
      toast.success(`${user.firstName} ${user.lastName} הוסר מהקבוצה בהצלחה`);
      router.refresh();
    }
  } catch (error: any) {
    console.error("Error leaving the group:", error);
  }
}

const GroupMembers: React.FC<Props> = ({ userId, group, isManager }) => {
  const router = useRouter();

  return (
    <ul className="max-h-[400px] overflow-y-auto">
      <div className="flex items-center gap-2">
        <span className="text-gray font-bold">חברים</span>
        {isManager && <AddFriendsDialog group={group} />}{" "}
      </div>
      {group.groupMembers.map((member, idx) => (
        <li key={"m" + idx} className="flex items-center justify-between">
          <Friend
            userId={userId}
            action={isManager ? "remove" : undefined}
            friend={member.user}
            relationId={undefined}
            onClick={() => {
              removeHandler(member.user, group.groupId, router);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default GroupMembers;
