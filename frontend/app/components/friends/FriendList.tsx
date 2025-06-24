"use client";

import { User } from "@/app/types/User";
import React, { useState } from "react";
import Friend from "./Friend";
import { authFetch } from "@/lib/authFetch";

type FriendRelation = {
  id: string;
  user1: User;
  user2: User;
};

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
        throw new Error("Failed to remove friend");
      }
      setFriendRelations((prev) => prev.filter((rel) => rel.id !== relationId));
    } catch (error) {
      console.error("Error removing friend request:", error);
    }
  };

  return (
    <section className="h-[220px]">
      <h1>החברים שלי</h1>
      {friendsWithRelation.length === 0 ? (
        <p className="text-sm text-gray-500">אין חברים להצגה</p>
      ) : (
        <ul className="text-sm text-gray-700">
          {friendsWithRelation.map(({ friend, relationId }, index) => (
            <React.Fragment key={relationId}>
              <li className="flex items-center justify-between">
                <Friend
                  userId={currentUserUid}
                  action="remove"
                  friend={friend}
                  relationId={relationId}
                  onClick={() => removeFriend(relationId)}
                />
              </li>
              {index < friendsWithRelation.length - 1 && (
                <div className="my-1 h-px bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FriendList;
