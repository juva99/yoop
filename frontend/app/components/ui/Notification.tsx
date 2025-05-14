import React from "react";
import FriendReq from "../friends/FriendReq";
import { FriendRelation } from "@/app/types/friend-relation";

type Props = {
  type: "friend-request" | "message";
  request?: FriendRelation;
  requestClicked: (action: "approved" | "rejected") => void;
};

const Notification: React.FC<Props> = ({ type, request, requestClicked }) => {
  return (
    <div>
      {type === "friend-request" && request && (
        <FriendReq requestClicked={requestClicked} req={request} />
      )}
      {type === "message" && <div>messsage</div>}
    </div>
  );
};

export default Notification;
