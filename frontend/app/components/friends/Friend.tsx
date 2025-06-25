"use client";

import { User } from "@/app/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPersonAddOutline } from "react-icons/io5";
import { BsSendCheckFill } from "react-icons/bs";
import { FaUserXmark } from "react-icons/fa6";
import React, { useState } from "react";
import { authFetch } from "@/lib/authFetch";

type Props = {
  userId: string;
  friend: User;
  relationId?: string;
  action?: "remove" | "add";
  onClick?: () => void;
};

const Friend: React.FC<Props> = ({ userId, friend, action, onClick }) => {
  const [sentRequest, setSentRequest] = useState<boolean>(false);
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

      if (!response.ok) throw new Error("Failed to send friend request");
      setSentRequest(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Avatar className="flex h-7 w-7 rounded-full text-center font-bold text-white">
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${friend.uid}`}
            alt={friend.firstName}
          />
          <AvatarFallback>
            {friend.firstName.charAt(0)}
            {friend.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span>
          {friend.firstName} {friend.lastName}
        </span>
      </div>

      <div onClick={() => sendFriendRequest(friend.uid)}>
        {action === "add" &&
          (sentRequest ? (
            <BsSendCheckFill size="17px" />
          ) : (
            <IoPersonAddOutline size="17px" />
          ))}
      </div>
      {userId !== friend.uid && action === "remove" && (
        <div onClick={onClick}>
          <FaUserXmark color="gray" size="17px" />
        </div>
      )}
    </div>
  );
};

export default Friend;
