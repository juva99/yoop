"use client";

import { User } from "@/app/types/User";
import React, { useState } from "react";
import Friend from "./Friend";
import { authFetch } from "@/lib/authFetch";
import { FriendRelation } from "@/app/types/friend-relation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

type Props = {
  currentUserUid: string;
  relations: FriendRelation[];
};

const FriendList: React.FC<Props> = ({ currentUserUid, relations }) => {
  const [friendRelations, setFriendRelations] =
    useState<FriendRelation[]>(relations);
  //filter the relevant user from each relation
  const friendsWithRelation = friendRelations.map((rel) => ({
    friend: rel.user1.uid === currentUserUid ? rel.user2 : rel.user1,
    relationId: rel.id,
  }));

  const removeFriend = async (relationId: string) => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/set-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ req_uid: relationId, status: "rejected" }),
        },
      );

      if (!response.ok) {
        toast.error("שגיאה בביטול החברות");
        throw new Error("Failed to remove friend");
      }
      toast.success("ביטלת את החברות בהצלחה");
      setFriendRelations((prev) => prev.filter((rel) => rel.id !== relationId));
    } catch (error) {
      console.error("Error removing friend request:", error);
    }
  };

  return (
    <div className="space-y-4">
      {friendsWithRelation.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            אין חברים עדיין
          </h3>
          <p className="text-gray-600">
            התחל לחפש חברים חדשים והוסף אותם לרשימה שלך
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">רשימת החברים</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {friendsWithRelation.length} חברים
            </Badge>
          </div>

          <div className="scrollbar-none grid max-h-96 gap-3 overflow-y-auto">
            {friendsWithRelation.map(({ friend, relationId }) => (
              <div
                key={relationId}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Friend
                    userId={currentUserUid}
                    action="remove"
                    friend={friend}
                    relationId={relationId}
                    onClick={() => removeFriend(relationId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
