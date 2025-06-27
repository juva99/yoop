"use client";
import { authFetch } from "@/lib/authFetch";
import React, { useState, useRef, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Bell, Users, Check, X } from "lucide-react";
import { FriendRelation } from "@/app/types/friend-relation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
type Props = {};

const NotificationsButton: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<FriendRelation[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/pending-req`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const requests = await res.json();
      setNotifications(requests);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const onRequestClick = async (
    requestId: string,
    action: "approved" | "rejected",
  ) => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/set-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            req_uid: requestId,
            status: action,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to set status");

      // Remove the request from state manually
      setNotifications((prev) => prev.filter((item) => item.id !== requestId));

      if (action === "approved") {
        toast.success("בקשת החברות אושרה!");
      } else {
        toast.success("בקשת החברות נדחתה");
      }
    } catch (error) {
      console.error("Error setting request status:", error);
      toast.error("שגיאה בעדכון בקשת החברות");
    }
  };

  return (
    <div className="relative" ref={buttonRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-xl bg-blue-500 text-white hover:from-blue-600 hover:to-purple-600"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
          >
            {notifications.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-5 z-50 mt-2 w-80 border-0 bg-white/95 shadow-lg backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">הודעות חדשות</h4>
              </div>
              {notifications.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {notifications.length}
                </Badge>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">אין הודעות חדשות</p>
              </div>
            ) : (
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${notification.user1.uid}`}
                            alt={notification.user1.firstName}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white">
                            {notification.user1.firstName.charAt(0)}
                            {notification.user1.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            בקשת חברות מ: {notification.user1.firstName}{" "}
                            {notification.user1.lastName}
                          </p>
                          <p className="text-xs text-gray-600">
                            לחץ לאישור או דחייה
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            onRequestClick(notification.id, "approved")
                          }
                          className="bg-green-500 px-3 text-white hover:bg-green-600"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onRequestClick(notification.id, "rejected")
                          }
                          className="border-red-200 px-3 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsButton;
