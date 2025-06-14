import { Group } from "@/app/types/Group";
import { authFetch } from "@/lib/authFetch";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    group_id: string;
  }>;
};

const page: React.FC<Props> = async ({ params }) => {
  const { group_id } = await params;

  const groupResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${group_id}`,
    {
      method: "GET",
    },
  );
  if (!groupResponse.ok) {
    redirect("/groups");
  }
  const group: Group = await groupResponse.json();

  return (
    <div>
      <span>
        {group.groupName}
        {group.gameTypes.map((t) => (
          <p>{t}</p>
        ))}
      </span>
      <span>{group.gameTypes}</span>
    </div>
  );
};

export default page;
