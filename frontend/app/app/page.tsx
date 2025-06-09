import FutureGames from "@/components/FutureGames";
import Search from "@/components/searchComponents/search-games";
import NotificationsButton from "@/components/ui/Notifications";
import { getMyGames } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
export default async function Home() {
  const data = await getMyGames();

  const session = await getSession();

  const userName = session!.user.name;

  return (
    <div className="mb-10 flex flex-col gap-6 p-3">
      <div className="mb-2 flex flex-row items-center justify-between">
        <h1>היי {userName.split(" ")[0]}, </h1>
        <NotificationsButton />
      </div>
      <div>
        <Card>
          <span className="font-semibold">משחקים עתידיים</span>
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
