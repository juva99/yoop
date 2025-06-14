import { GameType } from "../enums/game-type.enum";
import { GroupMember } from "./GroupMember";

export type Group = {
  groupId: string;
  groupName: string;
  gameTypes: GameType[];
  groupMembers: GroupMember[];
  imageUrl?: string;
};
