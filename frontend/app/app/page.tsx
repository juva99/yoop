import FutureGames from "@/components/FutureGames";
import Search from "@/components/searchComponents/search-games";
import { getMyGames } from "@/lib/actions";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const data = await getMyGames();

  return (
    <div className="mb-10 flex flex-col gap-6 px-3">
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
