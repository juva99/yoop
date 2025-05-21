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
    <div className="h-[80vh] bg-[url('/search-friends-background.png')] bg-cover bg-top bg-no-repeat px-7 py-10">
      <div className="rounded-md bg-white p-6 shadow-md">
        <h1 className="text-title mb-6 text-center text-2xl font-bold">
          הפרופיל שלי{" "}
        </h1>
        <section className="mb-6">
          <ProfileInfo user={user} role={role} />
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
