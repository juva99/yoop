import { Player } from "./Player";

export type Game = {
  id: string;
  field_name: string;
  type: string;
  date: string;
  time: string;
  players: Player[];
  price?: number;
};
