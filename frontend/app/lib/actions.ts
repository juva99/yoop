"use server";

import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import { Game } from "@/app/types/Game";
import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";
import { User } from "@/app/types/User";
import { getSession } from "./session";
import { FriendRelation } from "@/app/groups/new/NewGroupForm";
import { Group } from "@/app/types/Group";

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

export const getMyFriends = async (): Promise<User[]> => {
  const session = await getSession();
  const userId = session!.user.uid;
  const friendsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/getAll`,
  );
  const friendRelations = await friendsResponse.json();
  const friendList: User[] = friendRelations.map((rel: FriendRelation) =>
    rel.user1.uid === userId ? rel.user2 : rel.user1,
  );
  return friendList;
};

export const getMyGroups = async (): Promise<Group[]> => {
  const friendsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/mygroups`,
  );
  return await friendsResponse.json();
};

export async function fetchUserById(id: string): Promise<User> {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`,
  );
  if (!res.ok) throw new Error(`לא ניתן להביא את המשתמש עם מזהה ${id}`);
  return res.json();
}

export const inviteFriendsToGame = async (
  gameId: string,
  friendIds: string[],
) => {
  const friends = await Promise.all(friendIds.map((id) => fetchUserById(id)));

  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}/invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteds: friends,
      }),
    },
  );

  if (!response.ok) {
    let errorMessage = "Failed to invite friends";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }
    return { ok: false, message: errorMessage };
  }

  return { ok: true, message: "החברים הוזמנו בהצלחה!" };
};

export const inviteGroupToGame = async (gameId: string, groupId: string) => {
  // Get group users first
  const groupUsersResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/users`,
  );
  if (!groupUsersResponse.ok) {
    return { ok: false, message: "Failed to get group members" };
  }

  const groupUsers = await groupUsersResponse.json();

  // Invite all group users
  const response = await authFetch(`${BACKEND_URL}/games/${gameId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inviteds: groupUsers,
    }),
  });
  if (!response.ok) {
    let errorMessage = "Failed to invite group";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }
    return { ok: false, message: errorMessage };
  }

  return { ok: true, message: "הקבוצה הוזמנה בהצלחה!" };
};
