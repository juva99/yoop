"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Button } from "@/components/ui/button";

const NewGroupBtn: React.FC = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/groups/new")}
      className="flex items-center gap-2 bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      size="lg"
    >
      <AiOutlineUsergroupAdd size={20} />
      <span>הוסף קבוצה חדשה</span>
    </Button>
  );
};

export default NewGroupBtn;
