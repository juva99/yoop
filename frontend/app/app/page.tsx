import FutureGames from "@/components/FutureGames";
import GroupsList from "@/components/GroupsList";
import MapView from "@/components/MapView";
import Search from "@/components/searchComponents/Search";
import SearchGame from "@/components/searchComponents/SearchGame";

export default function Home() {

  return (
    <div className="mb-10 flex flex-col gap-6 p-4 pb-6">
      <section>
        <p className="text-title text-2xl font-bold">היי יובל, </p>
      </section>
      <div className="rounded-2xl shadow-xl">
        <FutureGames/>
      </div>
      <Search />
    </div>
  );
}
