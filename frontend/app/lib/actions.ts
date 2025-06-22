"use server";

import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { Game } from "@/app/types/Game";
import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";
import { FriendRelation } from "./type";

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
    return { ok: false, message: "Failed to join game" };
  }
  return { ok: true, message: "Successfully joined game" };
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
    return { ok: false, message: errorMessage };
  }
  return { ok: true, message: "Successfully left game" };
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
    let errorMessage = "Failed to change status";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }
    console.error(errorMessage);
    return { ok: false, message: errorMessage };
  }

  if (status === ParticipationStatus.APPROVED) {
    return { ok: true, message: "השחקן אושר!" };
  }
  return { ok: true, message: "השחקן הוסר!" };
};

export const getMyGames = async (): Promise<Game[]> => {
  const response = await authFetch(`${BACKEND_URL}/games/mygames`);

  if (!response.ok) {
    console.error("Failed to fetch my games:", response.statusText);
    return [];
  }

  const games = await response.json();

  return games;
};

export const setGameCreator = async (gameId: string, userId: string) => {
  const res = await authFetch(
    `${BACKEND_URL}/games/${gameId}/setGameCreator/${userId}`,
    {
      method: "PATCH",
    },
  );

  if (!res.ok) {
    console.error("שינוי מנהל משחק נכשל");
    return { ok: false, message: "שינוי מנהל משחק נכשל" };
  }

  return { ok: true, message: "המנהל שונה בהצלחה" };
};

export const fetchFriendsFromRelations = async (
  relations: FriendRelation[],
  userId: string,
) => {
  return relations.map((rel) =>
    rel.user1.uid === userId
      ? {
          id: rel.user2.uid,
          firstName: rel.user2.firstName,
          lastName: rel.user2.lastName,
        }
      : {
          id: rel.user1.uid,
          firstName: rel.user1.firstName,
          lastName: rel.user1.lastName,
        },
  );
};
