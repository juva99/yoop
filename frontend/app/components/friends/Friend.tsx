"use client";

import { User } from "@/app/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserCheck, UserX, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 sm:gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 border-2 border-white shadow-md sm:h-12 sm:w-12">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${friend.uid}`}
                alt={friend.firstName}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-900 text-xs font-bold text-white sm:text-sm">
                {friend.firstName.charAt(0)}
                {friend.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {friend.firstName} {friend.lastName}
              </span>
              {action === "add" && sentRequest && (
                <Badge
                  variant="secondary"
                  className="mt-1 w-fit bg-green-100 text-xs text-green-700"
                >
                  בקשה נשלחה
                </Badge>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-md">
          <DialogTitle className="sr-only">
            פרטי חבר: {friend.firstName} {friend.lastName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            צפייה בפרטי יצירת קשר של {friend.firstName} {friend.lastName}
          </DialogDescription>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
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
        </DialogContent>
      </Dialog>

      <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
        {action === "add" && (
          <Button
            onClick={() => sendFriendRequest(friend.uid)}
            disabled={sentRequest || isLoading}
            size="sm"
            className={`${
              sentRequest
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } px-2 py-1 text-xs transition-colors sm:px-3 sm:py-2 sm:text-sm`}
          >
            {isLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-white sm:h-4 sm:w-4" />
            ) : sentRequest ? (
              <>
                <UserCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">נשלח</span>
              </>
            ) : (
              <>
                <UserPlus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">הוסף</span>
              </>
            )}
          </Button>
        )}

        {userId !== friend.uid && action === "remove" && (
          <Button
            onClick={onClick}
            variant="outline"
            size="sm"
            className="border-red-200 px-2 py-1 text-xs text-red-600 hover:border-red-300 hover:bg-red-50 sm:px-3 sm:py-2 sm:text-sm"
          >
            <UserX className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">הסר</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Friend;
