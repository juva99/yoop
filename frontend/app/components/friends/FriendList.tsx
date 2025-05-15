"use client";

import { User } from "@/app/types/User";
import React from "react";

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
  // נבנה את הרשימה האמיתית של החברים לפי הצד השני של הקשר
  const friends = relations.map((rel) =>
    rel.user1.uid === currentUserUid ? rel.user2 : rel.user1,
  );

  return (
    <section className="p-4">
      <h2 className="mb-3 text-lg font-semibold text-[#002366]">החברים שלי</h2>
      {friends.length === 0 ? (
        <p className="text-sm text-gray-500">אין חברים להצגה</p>
      ) : (
        <ul className="space-y-2 text-sm text-gray-700">
          {friends.map((friend) => (
            <li key={friend.uid} className="flex items-center justify-between">
              <span>{friend.firstName}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FriendList;
