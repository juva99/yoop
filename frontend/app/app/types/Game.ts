import { GameStatus } from "../enums/game-status.enum";
import { GameType } from "../enums/game-type.enum";
import { Field } from "./Field";
import { GameParticipant } from "./GameParticipant";
import { User } from "./User";

export type Game = {
  gameId: string;
  gameType: GameType;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  status: GameStatus;
  gameParticipants: GameParticipant[];
  creator: User;
  field: Field;
  price?: number;
  weatherTemp?: number;
  weatherCondition?: string;
  weatherIcon?: string;
}
