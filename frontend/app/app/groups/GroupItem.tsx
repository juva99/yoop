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
import { Button } from "@/components/ui/button";

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
      <Link href={`/groups/${group.groupId}`} className="flex-1">
        <div className="flex items-center gap-4">
          {/* Game Type Icons */}
          <div className="flex items-center gap-1">
            {group.gameTypes.map((t, index) => (
              <div
                key={"icon" + index}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
              >
                {t === GameType.BasketBall ? (
                  <PiBasketball className="h-5 w-5 text-blue-600" />
                ) : (
                  <PiSoccerBall className="h-5 w-5 text-green-600" />
                )}
              </div>
            ))}
          </div>

          {/* Group Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {group.groupName}
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <AvatarGroup players={players} />
              <span className="text-sm text-gray-600">
                {players.length} חברים
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete Button for Managers */}
      {isManager && (
        <div className="mr-4">
          <AlertPopup
            message={`בחרת למחוק את ${group.groupName}`}
            onClick={deleteHandler}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <TiDelete size={20} />
            </Button>
          </AlertPopup>
        </div>
      )}
    </div>
  );
};

export default GroupItem;
