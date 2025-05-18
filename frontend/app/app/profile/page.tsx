import { User } from "@/app/types/User";
import FriendList from "@/components/friends/FriendList";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { Separator } from "@/components/ui/separator";

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

  return  <div className="w-full p-4">
          <div className="rounded-md bg-white p-6">
              <h1 className="mb-6 text-2xl text-[#002366]">פרופיל אישי </h1>

              <section className="mb-6">
                  <ProfileInfo user={user} friendRelations={friendRelations} />
                  <Separator />
                  <FriendList currentUserUid={user.uid} relations={friendRelations} />
              </section>
          </div>
        </div>
;
};

export default ProfilePage;
