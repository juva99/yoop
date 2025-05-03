import FutureGames from "@/components/FutureGames";
import GroupsList from "@/components/GroupsList";
import MapView from "@/components/MapView";
import Search from "@/components/searchComponents/Search";
import SearchGame from "@/components/searchComponents/SearchGame";
import { authFetch } from "@/lib/authFetch";

export default async function Home() {
  const res = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/mygames`,
  );
  const data = await res.json();

  return (
    <div className="mb-10 flex flex-col gap-6 p-4 pb-6">
      <section>
        <p className="text-title text-2xl font-bold">היי יובל, </p>
      </section>
      <div className="rounded-2xl shadow-xl">
        <FutureGames games={data} />
      </div>
      <div>
        <p className="text-subtitle text-xl font-bold">משחקים בעיר</p>
        <MapView defaultLocation={{ lng: 34.79, lat: 32.13 }} games={[]} />
      </div>
      <Search />
    </div>
  );
}
