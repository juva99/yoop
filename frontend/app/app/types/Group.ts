import { GameType } from "../enums/game-type.enum";

export type Group = {
  groupId: string;
  groupName: string;
  gameTypes: GameType[];
  groupMembers: string[];
  imageUrl?: string;
};
