"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";

type Props = {
  count?: number;
  notifications?: string[]; // example list of strings
};

const NotificationsButton: React.FC<Props> = ({
  count = 3,
  notifications = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  return (
    <div className="relative" ref={buttonRef}>
      {/* Bell Icon */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-title relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
      >
        <IoIosNotifications color="white" size={24} />
        {count > 0 && (
          <span className="bg-subtitle absolute -top-1 -right-1 rounded-full px-1.5 py-0.5 text-xs font-bold text-white shadow-md">
            {count}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full -right-40 z-10 mt-2 w-60 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">
            הודעות חדשות
          </h4>
          {notifications.length === 0 ? (
            <p className="text-xs text-gray-500">אין הודעות חדשות</p>
          ) : (
            <ul className="max-h-48 space-y-1 overflow-y-auto">
              {notifications.map((note, index) => (
                <li
                  key={index}
                  className="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {note}
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
