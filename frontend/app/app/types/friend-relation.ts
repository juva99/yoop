import { User } from "./User";

export interface FriendRelation {
  id: string;
  user1: User;
  user2: User;
  status: "pending" | "accepted" | "rejected";
}
