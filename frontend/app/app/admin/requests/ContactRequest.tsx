"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
        toast.success("הבקשה אושרה בהצלחה");
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
        toast.success("בקשת ההצטרפות נדחתה");
      } else {
        toast.error("אירעה שגיאה");
      }
    }
  };

  const formatPhoneNumber = (phoneNum: string) => {
    return `972${phoneNum.substring(1)}`;
  };

  return (
    <div className="relative text-sm text-gray-600">
      <div className="flex flex-col gap-0.5">
        <p>
          <strong>שם:</strong> {firstName} {lastName}
        </p>
        <p>
          <strong>מייל:</strong> {email}
        </p>
        <div className="flex items-center gap-2">
          <strong>טלפון:</strong> {phoneNum}
          <Link
            href={`https://wa.me/${formatPhoneNumber(phoneNum)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={16} className="text-[#25D366]" />
          </Link>
        </div>
        <p>
          <strong>הודעה:</strong> {message}
        </p>
      </div>

      <div className="absolute top-2 left-2 flex gap-2">
        <Button
          onClick={() => handleAction("approve")}
          variant="actions"
          className="bg-title h-8"
        >
          אשר
        </Button>
        <Button
          onClick={() => handleAction("decline")}
          variant="actions"
          className="h-8"
        >
          דחה
        </Button>
      </div>
    </div>
  );
};

export default ContactRequest;
