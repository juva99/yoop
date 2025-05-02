import { ParticipationStatus } from "../enums/participation-status.enum";
import { Game } from "./Game";
import { User } from "./User";


export type GameParticipant = {
  uid: string;
  game: Game;
  user: User;
  status: ParticipationStatus;
}
