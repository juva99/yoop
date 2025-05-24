"use server";

import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { Game } from "@/app/types/Game";
import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

type ProtectedResponse = {
  message: string;
};

//temp - only for testing
export const getProfile = async (): Promise<ProtectedResponse> => {
  const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  const result = await response.json();
  return result;
};

export const joinGame = async (gameId: string) => {
  const response = await authFetch(`${BACKEND_URL}/games/${gameId}/join`, {
    method: "POST",
  });

  if (!response.ok) {
    console.error("Failed to join game");
  }
};

export const leaveGame = async (gameId: string) => {
  const response = await authFetch(`${BACKEND_URL}/games/${gameId}/leave`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorMessage = "Failed to leave game";
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorMessage;
    } catch (error) {
      console.error("Failed to parse error message: " + error);
    }
    throw new Error(errorMessage);
  }
};

export const changeParticipationStatus = async (
  gameId: string,
  uid: string,
  status: ParticipationStatus,
) => {
  const response = await authFetch(
    `${BACKEND_URL}/game-participants/set-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
        gameId: gameId,
        newStatus: status,
      }),
    },
  );

  if (!response.ok) {
    console.error("Failed to join game");
  }
};

export const getMyGames = async (): Promise<Game[]> => {
  const response = await authFetch(`${BACKEND_URL}/games/mygames`);

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`);
  }

  const games = await response.json();

  return games;
};
