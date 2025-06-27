"use client";

import { User } from "@/app/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IoPersonAddOutline } from "react-icons/io5";
import { BsSendCheckFill } from "react-icons/bs";
import { FaUserXmark } from "react-icons/fa6";
import { UserPlus, UserCheck, UserX, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Props = {
  userId: string;
  friend: User;
  relationId?: string;
  action?: "remove" | "add";
  onClick?: () => void;
};

const Friend: React.FC<Props> = ({ userId, friend, action, onClick }) => {
  const [sentRequest, setSentRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendFriendRequest = async (friendId: string) => {
    if (isLoading) return;

    setIsLoading(true);
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
        toast.error("שגיאה בשליחת בקשת חברות");
        throw new Error("Failed to send friend request");
      }

      setSentRequest(true);
      toast.success("בקשת חברות נשלחה בהצלחה!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("שגיאה בשליחת בקשת חברות");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex cursor-pointer items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${friend.uid}`}
                alt={friend.firstName}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-900 font-bold text-white">
                {friend.firstName.charAt(0)}
                {friend.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {friend.firstName} {friend.lastName}
              </span>
              {action === "add" && sentRequest && (
                <Badge
                  variant="secondary"
                  className="w-fit bg-green-100 text-xs text-green-700"
                >
                  בקשה נשלחה
                </Badge>
              )}
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80" side="top">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${friend.uid}`}
                  alt={friend.firstName}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-900 text-lg font-bold text-white">
                  {friend.firstName.charAt(0)}
                  {friend.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">
                  {friend.firstName} {friend.lastName}
                </h4>
                <p className="text-sm text-gray-600">משתמש פעיל</p>
              </div>
            </div>

            {friend.userEmail && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{friend.userEmail}</span>
              </div>
            )}

            {friend.phoneNum && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{friend.phoneNum}</span>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex items-center gap-2">
        {action === "add" && (
          <Button
            onClick={() => sendFriendRequest(friend.uid)}
            disabled={sentRequest || isLoading}
            size="sm"
            className={`${
              sentRequest
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } transition-colors`}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
            ) : sentRequest ? (
              <>
                <UserCheck className="mr-1 h-4 w-4" />
                נשלח
              </>
            ) : (
              <>
                <UserPlus className="mr-1 h-4 w-4" />
                הוסף
              </>
            )}
          </Button>
        )}

        {userId !== friend.uid && action === "remove" && (
          <Button
            onClick={onClick}
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
          >
            <UserX className="mr-1 h-4 w-4" />
            הסר
          </Button>
        )}
      </div>
    </div>
  );
};

export default Friend;
