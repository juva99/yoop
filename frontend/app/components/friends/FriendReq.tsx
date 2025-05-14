import { FriendRelation } from "@/app/types/friend-relation";
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Props = {
  req: FriendRelation;
  requestClicked: (action: "approved" | "rejected") => void;
};
const FriendReq: React.FC<Props> = ({ req, requestClicked }) => {
  return (
    <div className="flex w-full items-center justify-between py-2 hover:bg-gray-100">
      <div className="text-sm text-gray-700">
        <span>יש לך בקשת חברות מ: </span>
        <span className="font-semibold">
          {req.user1.firstName} {req.user1.lastName}
        </span>
      </div>
      <div className="actions flex gap-2">
        <button
          className="flex items-center justify-center"
          onClick={() => {
            requestClicked("approved");
          }}
        >
          <FaCheckCircle size={15} color="green" />
        </button>
        <button
          className="flex items-center justify-center"
          onClick={() => {
            requestClicked("rejected");
          }}
        >
          <FaTimesCircle size={15} color="red" />
        </button>
      </div>
    </div>
  );
};

export default FriendReq;
