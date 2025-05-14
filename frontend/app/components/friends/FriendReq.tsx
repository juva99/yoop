import { User } from "@/app/types/User";
import React from "react";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { LiaTimesCircle } from "react-icons/lia";

type Props = {
  sender: User;
};

const FriendReq: React.FC<Props> = ({ sender }) => {
  return (
    <div className="flex w-full items-center justify-between border px-5 py-2 hover:bg-gray-100">
      <div>
        <span>יש לך בקשת חברות מ:</span>
        <span>
          {sender.firstName} {sender.firstName}
        </span>
      </div>
      <div className="actions">
        <LiaTimesCircle />
        <LiaPlusCircleSolid />
      </div>
    </div>
  );
};

export default FriendReq;
