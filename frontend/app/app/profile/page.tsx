import { User } from "@/app/types/User";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { Role } from "@/app/enums/role.enum";

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
  const role: Role = session?.user?.role ?? ("USER" as Role);

  return (
    <div className="px-3">
      <div className="rounded-xl bg-white p-6">
        <ProfileInfo user={user} role={role} />
      </div>
    </div>
  );
};

export default ProfilePage;
