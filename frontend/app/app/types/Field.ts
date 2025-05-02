import { GameType } from "../enums/game-type.enum";
import { Game } from "./Game";
import { User } from "./User";

export type Field = {
  fieldId: string;
  fieldName: string;
  gameTypes: GameType[];
  isManaged: boolean;
  fieldPhoto?: string;
  fieldLat?: number;
  fieldLng?: number;
  fieldAddress?: string;
  city: string;
  manager: User;
  gamesInField: Game[];
}
