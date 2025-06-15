import { GameType } from "@/app/enums/game-type.enum";
import { Group } from "@/app/types/Group";
import { authFetch } from "@/lib/authFetch";
import { redirect } from "next/navigation";
import React from "react";
import { PiBasketball, PiSoccerBall } from "react-icons/pi";

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
  // need to add all relevant details about the group and add edit button with navigate to edit (version of create form)
  return (
    <div className="px-5 py-10">
      <span>
        {group.groupName}
        {group.gameTypes.map((t, index) =>
          t === GameType.BasketBall ? (
            <PiSoccerBall key={"icon" + index} />
          ) : (
            <PiBasketball key={"icon" + index} />
          ),
        )}
      </span>
    </div>
  );
};

export default page;
