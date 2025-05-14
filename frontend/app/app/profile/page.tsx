import { User } from "@/app/types/User";
import FriendList from "@/components/friends/FriendList";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";

type Props = {};

const ProfilePage: React.FC<Props> = async () => {
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

  return (
    <div className="px-8 py-6">
      <div className="rounded-md bg-white p-6">
        <h1 className="mb-6 text-2xl font-semibold text-[#002366]">פרופיל</h1>
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#002366]">
            פרטים אישיים
          </h2>
          <p>
            <strong>שם:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>אימייל:</strong> {user.userEmail || "לא צויין"}
          </p>
          <p>
            <strong>טלפון:</strong> {user.phoneNum || "לא צויין"}
          </p>
        </section>

        {/* Friends List Section */}
        <hr className="my-6 border-t border-gray-200" />
        <FriendList currentUserUid={user.uid} relations={friendRelations} />
      </div>
    </div>
  );
};

export default ProfilePage;
