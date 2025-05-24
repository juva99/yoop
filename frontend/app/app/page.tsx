import FutureGames from "@/components/FutureGames";
import Search from "@/components/searchComponents/search-games";
import NotificationsButton from "@/components/ui/Notifications";
import { getMyGames } from "@/lib/actions";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const data = await getMyGames();

  const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    redirect("/auth/login");
  }

  const userName = session.user.name;

  return (
    <div className="mb-10 flex flex-col gap-6 p-4 pb-6">
      <div className="mb-2 flex flex-row items-center justify-between">
        <p className="text-title text-2xl font-bold">
          היי {userName.split(" ")[0]},{" "}
        </p>
        <NotificationsButton />
      </div>
      <div>
        <span className="text-subtitle text-l mb-2">משחקים עתידיים</span>
        <FutureGames games={data} />
      </div>
      <Search />
    </div>
  );
}
