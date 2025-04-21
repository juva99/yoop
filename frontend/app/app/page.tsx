import FutureGames from "@/components/FutureGames";
import GroupsList from "@/components/GroupsList";
import { MapView } from "@/components/MapView";

export default function Home() {
  const sampleGame = {
    id: "g1",
    field_name: "עמק אילון 9",
    type: "soccer",
    date: "4.10",
    time: "16:00",
    players: [
      { name: "אלכס", image: "bla.ico" },
      { name: "גיימס", image: "bla.ico" },
      { name: "אלפא", image: "bla.ico" },
      { name: "סקיבידי", image: "bla.ico" },
      { name: "ריזז", image: "bla.ico" },
    ],
    price: 30,
  };
  const sampleGame2 = {
    id: "g2",
    field_name: "עמק  9",
    type: "soccer",
    date: "4.10",
    time: "16:00",
    players: [
      { name: "Player 1", image: "favicon.ico" },
      { name: "Player 2", image: "favicon.ico" },
      { name: "Player 3", image: "favicon.ico" },
      { name: "Player 4", image: "favicon.ico" },
      { name: "Player 5", image: "favicon.ico" },
    ],
    price: 30,
  };
  const groups = [
    {
      id: "g1",
      name: "הנבחרת של אבי",
      players: [
        { name: "Player 1", image: "favicon.ico" },
        { name: "Player 2", image: "favicon.ico" },
        { name: "Player 3", image: "favicon.ico" },
        { name: "Player 4", image: "favicon.ico" },
        { name: "Player 5", image: "favicon.ico" },
      ],
    },
    {
      id: "g2",
      name: "סיקיבידי ריזז",
      players: [
        { name: "Player 1", image: "favicon.ico" },
        { name: "Player 2", image: "favicon.ico" },
        { name: "Player 3", image: "favicon.ico" },
        { name: "Player 4", image: "favicon.ico" },
        { name: "Player 5", image: "favicon.ico" },
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
        <MapView />
      </div>

      <div>
        <p className="text-subtitle text-xl font-bold">הקבוצות שלך</p>
        <GroupsList groups={groups} />
      </div>
    </div>
  );
}
