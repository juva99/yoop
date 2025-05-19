import { authFetch } from "@/lib/authFetch";
import { Game } from "@/app/types/Game";
import GameItem from "./GameItem";

type Props = {
  params: {
    field_id: string;
  };
};

const Page: React.FC<Props> = async ({ params }) => {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/fieldId/${params.field_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    return <p>שגיאה בטעינת המשחקים</p>;
  }

  const games: Game[] = await response.json();

  return (
    <div className="p-5">
      <h1 className="text-title mb-6 text-2xl font-bold">רשימת משחקים</h1>
      <div className="field__game-list rounded-lg border-2 border-gray-300 p-4">
        {games.length === 0 ? (
          <p>אין משחקים להצגה</p>
        ) : (
          <div>
            {games.map((game) => (
              <GameItem key={game.gameId} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
