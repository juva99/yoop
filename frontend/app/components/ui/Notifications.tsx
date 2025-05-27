"use client";
import { authFetch } from "@/lib/authFetch";
import React, { useState, useRef, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { FriendRelation } from "@/app/types/friend-relation";
import Notification from "./Notification";
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

      // Remove the request from state manually (instead of assuming a list is returned)
      setNotifications((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error) {
      console.error("Error setting request status:", error);
    }
  };

  return (
    <div className="relative" ref={buttonRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-title relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
      >
        <IoIosNotifications color="white" size={24} />

        <span className="bg-subtitle absolute -top-1 -right-1 rounded-full px-1.5 py-0.5 text-xs font-bold text-white shadow-md">
          {notifications.length}
        </span>
      </div>
      {isOpen && (
        <div className="absolute top-full -right-60 z-10 mt-2 w-70 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">
            הודעות חדשות
          </h4>
          {notifications.length === 0 ? (
            <p className="text-xs text-gray-500">אין הודעות חדשות</p>
          ) : (
            <ul className="max-h-48 space-y-1 overflow-y-auto">
              {notifications.map((message, index) => (
                <li
                  key={index}
                  className="rounded py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Notification
                    requestClicked={(action) =>
                      onRequestClick(message.id, action)
                    }
                    type="friend-request"
                    request={message}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsButton;
