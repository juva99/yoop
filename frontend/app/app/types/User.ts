import { Field } from "./Field";
import { Game } from "./Game";
import { GameParticipant } from "./GameParticipant";

export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  birthDay: Date;
  isMale?: boolean;
  address?: string;
  profilePic?: string;
  phoneNum?: string;
  role: string;
  fieldsManage: Field[];
  friendList?: User[];
  gameParticipations: GameParticipant[];
  createdGames: Game[];
}
