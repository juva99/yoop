"use client";
import { User } from "@/app/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IoPersonAddOutline } from "react-icons/io5";
import { authFetch } from "@/lib/authFetch";
import { BsSendCheckFill } from "react-icons/bs";
import React, { useState } from "react";

type Props = {
  friend: User;
};

const Friend: React.FC<Props> = ({ friend }) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const sendFriendRequest = async (friendId: string) => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/send-req`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_uid: friendId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }

      const data = await response.json();
      setIsSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-between border px-5 py-2 hover:bg-gray-100">
      <div className="flex items-center gap-2">
        <Avatar className="border-gray h-8 w-8 rounded-full border-2 text-center">
          <AvatarImage src={friend.profilePic} alt={friend.firstName} />
          <AvatarFallback>{friend.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>
          {friend.firstName} {friend.lastName}
        </span>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => sendFriendRequest(friend.uid)}
      >
        {isSent ? (
          <BsSendCheckFill size="20px" />
        ) : (
          <IoPersonAddOutline size="20px" />
        )}
      </div>
    </div>
  );
};

export default Friend;
