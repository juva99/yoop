import React from "react";
import ContactRequest from "./ContactRequest";
import { authFetch } from "@/lib/authFetch";
import { Card } from "@/components/ui/card";

type ContactRequestType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  message: string;
};

async function getContactRequests(): Promise<ContactRequestType[]> {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/manager-signup`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    console.error("Failed to fetch contact requests");
    return [];
  }

  return response.json();
}

const page = async () => {
  const requests = await getContactRequests();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            בקשות מנהלי מגרשים
          </h1>
          <p className="mt-2 text-gray-600">
            סקור ואשר בקשות להצטרפות כמנהלי מגרשים
          </p>
          <div className="mt-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {requests.length} בקשות ממתינות
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              אין בקשות להצגה
            </h3>
            <p className="text-gray-600">
              כל הבקשות עובדו או שאין בקשות חדשות כרגע
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Card
                key={req.id}
                className="p-6 transition-shadow hover:shadow-md"
              >
                <ContactRequest {...req} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
