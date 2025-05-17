import { User } from "@/app/types/User";
import FriendList from "@/components/friends/FriendList";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import ProfileClient from "@/components/profile/ProfileClient";

const ProfilePage = async () => {
  const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    return null;
  }

  const userId = session.user.uid;
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`,
  );
  const user: User = await response.json();

  const friendsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/friends/getAll`,
  );
  const friendRelations = await friendsResponse.json();

  return <ProfileClient user={user} friendRelations={friendRelations} />;
};

export default ProfilePage;
