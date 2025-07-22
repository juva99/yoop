import { Card } from "@/components/ui/card";
import React from "react";
import NewGroupBtn from "../../components/groups/NewGroupBtn";
import Groups from "../../components/groups/Groups";

const page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">הקבוצות שלי</h1>
          <p className="mt-2 text-gray-600">
            נהל את הקבוצות שלך וצור קבוצות חדשות
          </p>
        </div>

        {/* Groups Content */}
        <div className="space-y-6">
          <Groups />
          <div className="flex justify-center">
            <NewGroupBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
