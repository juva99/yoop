"use client";
import { redirect } from "next/navigation";
import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const NewGroupBtn: React.FC = () => {
  return (
    <div
      className="text-title flex items-center gap-2 font-bold"
      onClick={() => {
        redirect("/groups/new");
      }}
    >
      <AiOutlineUsergroupAdd size={20} />
      <p className="text-lg underline">הוסף קבוצה</p>
    </div>
  );
};

export default NewGroupBtn;
