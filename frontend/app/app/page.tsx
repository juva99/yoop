import FutureGames from "@/components/FutureGames";
import GroupsList from "@/components/GroupsList";
import MapView from "@/components/MapView";
import Search from "@/components/searchComponents/Search";
import SearchGame from "@/components/searchComponents/SearchGame";

export default function Home() {
  const groups = [
    {
      id: "g1",
      name: "הנבחרת של אבי",
      players: [
        { name: "Player 1", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 2", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 3", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 4", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 5", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 5", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 5", image: "favicon.ico", phoneNum: "0527345050" },
      ],
    },
    {
      id: "g2",
      name: "סיקיבידי ריזז",
      players: [
        { name: "Player 1", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 2", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 3", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 4", image: "favicon.ico", phoneNum: "0527345050" },
        { name: "Player 5", image: "favicon.ico", phoneNum: "0527345050" },
      ],
    },
  ];

  return (
    <div className="mb-10 flex flex-col gap-6 p-4 pb-6">
      <section>
        <p className="text-title text-2xl font-bold">היי יובל, </p>
      </section>
      <div className="rounded-2xl shadow-xl">
        <FutureGames
          games={[sampleGame, sampleGame, sampleGame, sampleGame2]}
        />
      </div>
      <div>
        <p className="text-subtitle text-xl font-bold">משחקים בעיר</p>
        <MapView
          defaultLocation={{ lng: 34.79, lat: 32.13 }}
          games={[sampleGame, sampleGame2]}
        />
      </div>
      <Search />
    </div>
  );
}
