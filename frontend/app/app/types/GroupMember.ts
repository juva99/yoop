import { User } from "./User";

export type GroupMember = {
  id: string;
  user: User;
  isManager: boolean;
};
