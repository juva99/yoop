import FutureGames from "@/components/FutureGames";
import Search from "@/components/searchComponents/search-games";
import NotificationsButton from "@/components/ui/Notifications";
import { getMyGames } from "@/lib/actions";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
export default async function Home() {
  const data = await getMyGames();

  const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    redirect("/auth/login");
  }

  const userName = session.user.name;

  return (
    <div className="mb-10 flex flex-col gap-6 p-3">
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1>היי {userName.split(" ")[0]}, </h1>
        <NotificationsButton />
      </div>
      <div>
        <Card>
          <h3>משחקים עתידיים</h3>
          <FutureGames games={data} />
        </Card>
      </div>
      <Card>
        <h3>חיפוש משחק</h3>
        <Search />
      </Card>
    </div>
  );
}
