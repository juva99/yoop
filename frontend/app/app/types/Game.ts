import { Player } from "./Player";

export type Game = {
  id: string;
  field: { name: string; lat: any; lng: any };
  type: string;
  date: string;
  time: string;
  players: Player[];
  price?: number;
};
