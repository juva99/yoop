"use client";
import { redirect } from "next/navigation";
import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const NewGroupBtn: React.FC = () => {
  return (
    <div
      className="absolute left-3"
      onClick={() => {
        redirect("/groups/new");
      }}
    >
      <AiOutlineUsergroupAdd size={25} />
    </div>
  );
};

export default NewGroupBtn;
