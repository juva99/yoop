"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  MdEmail,
  MdPhone,
  MdMessage,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

export type ContactRequestProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  message: string;
};

const ContactRequest: React.FC<ContactRequestProps> = ({
  id,
  firstName,
  lastName,
  email,
  phoneNum,
  message,
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = async (action: "approve" | "decline") => {
    if (action === "approve") {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/approve-manager/${id}`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        router.refresh();
        toast.info("הבקשה אושרה בהצלחה");
      } else {
        toast.error("אירעה שגיאה");
      }
    } else {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/manager-signup/delete/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        router.refresh();
        toast.info("בקשת ההצטרפות נדחתה");
      } else {
        toast.error("אירעה שגיאה");
      }
    }
  };

  const formatPhoneNumber = (phoneNum: string) => {
    return `972${phoneNum.substring(1)}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with name, actions, and toggle */}
      <div className="flex items-center justify-between">
        <div
          className="flex flex-1 cursor-pointer items-center gap-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-gray-600">מועמד למנהל מגרש</p>
          </div>
          <div className="ml-auto">
            {isExpanded ? (
              <MdExpandLess className="h-5 w-5 text-gray-500" />
            ) : (
              <MdExpandMore className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>

        <div className="ml-4 flex gap-2">
          <Button
            onClick={() => handleAction("approve")}
            variant="default"
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            אשר
          </Button>
          <Button
            onClick={() => handleAction("decline")}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            דחה
          </Button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <MdPhone className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{phoneNum}</p>
                <p className="text-xs text-gray-600">טלפון</p>
              </div>
              <Link
                href={`https://wa.me/${formatPhoneNumber(phoneNum)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-1 transition-colors hover:bg-green-100"
              >
                <FaWhatsapp size={20} className="text-[#25D366]" />
              </Link>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <MdEmail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{email}</p>
                <p className="text-xs text-gray-600">אימייל</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MdMessage className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">הודעה</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{message}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactRequest;
