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
    <div className="h-[100vh] bg-[url('/search-friends-background.png')] bg-top bg-no-repeat p-3">
      <Card className="scrollbar-none max-h-full overflow-y-scroll p-4">
        <h1>בקשות מנהלי מגרשים</h1>{" "}
        <div className="">
          {requests.length === 0 ? (
            <p className="text-center">אין בקשות להצגה.</p>
          ) : (
            requests.map((req, idx) => (
              <div
                key={req.id}
                className={
                  idx < requests.length - 1
                    ? "mb-4 border-b border-gray-200 pb-4"
                    : ""
                }
              >
                <ContactRequest {...req} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default page;
