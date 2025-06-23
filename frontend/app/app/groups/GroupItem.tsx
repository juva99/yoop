"use client";

import React from "react";
import { Group } from "../types/Group";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";
import { TiDelete } from "react-icons/ti";
import Link from "next/link";

import { GameType } from "../enums/game-type.enum";
import AlertPopup from "@/components/AlertPopup";
import AvatarGroup from "@/components/AvatarGroup";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  group: Group;
  userId: string;
  isManager?: boolean;
};

const GroupItem: React.FC<Props> = ({ group, isManager }) => {
  const router = useRouter();
  const players = group.groupMembers.map((groupMember) => groupMember.user);

  const deleteHandler = async () => {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/delete/${group.groupId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data?.message || "שגיאה במחיקת הקבוצה";
      toast.error(message);
    } else {
      toast.success("מחקת את הקבוצה בהצלחה");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="w-[90%]">
        <Link href={`/groups/${group.groupId}`}>
          <p className="text-title flex items-center gap-2 text-lg font-bold">
            {group.gameTypes.map((t, index) =>
              t === GameType.BasketBall ? (
                <PiSoccerBall key={"icon" + index} />
              ) : (
                <PiBasketball key={"icon" + index} />
              ),
            )}
            {group.groupName}
          </p>
          <AvatarGroup players={players} />
        </Link>
      </div>
      {isManager && (
        <div>
          <AlertPopup
            message={`בחרת למחוק את ${group.groupName}`}
            onClick={deleteHandler}
          >
            <TiDelete size={20} />
          </AlertPopup>
        </div>
      )}
    </div>
  );
};

export default GroupItem;
