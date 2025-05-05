import ExpandableGameCard from "@/components/ExpandableGameCard";
import { getMyGames } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ParticipationStatus } from "../enums/participation-status.enum";

export default async function MyGames() {
  const games = await getMyGames();
  const session = await getSession();
  if (!session?.user?.uid) {
    console.error("Invalid session or user credentials");
    redirect("/auth/login");
  }
  const currUserUID = session.user.uid;

  const managedGames = games.filter((game) => game.creator.uid === currUserUID);
  const approvedGames = games.filter((game) =>
    game.gameParticipants.some(
      (gp) =>
        gp.user.uid === currUserUID &&
        gp.status === ParticipationStatus.APPROVED,
    ),
  );

  const pendingGames = games.filter((game) =>
    game.gameParticipants.some(
      (gp) =>
        gp.user.uid === currUserUID &&
        gp.status === ParticipationStatus.PENDING,
    ),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-10">
        <p className="mb-4 text-right text-2xl font-bold">משחקים בניהולך</p>
        {managedGames.length === 0 ? (
          <p className="rounded border bg-gray-50 py-8 text-center text-lg text-gray-500 shadow-sm">
            אין משחקים בניהולך
          </p>
        ) : (
          <div className="space-y-4">
            {managedGames.map((game, index) => (
              <ExpandableGameCard
                key={index}
                game={game}
                buttonTitle="לעמוד המשחק"
              />
            ))}
          </div>
        )}
      </div>
      <div className="mb-10">
        <p className="mb-4 text-right text-2xl font-bold">המשחקים שלי</p>
        {managedGames.length === 0 ? (
          <p className="rounded border bg-gray-50 py-8 text-center text-lg text-gray-500 shadow-sm">
            אין משחקים עתידיים
          </p>
        ) : (
          <div className="space-y-4">
            {approvedGames.map((game, index) => (
              <ExpandableGameCard
                key={index}
                game={game}
                buttonTitle="לעמוד המשחק"
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="mb-4 text-right text-2xl font-bold">משחקים בהמתנה</p>
        {pendingGames.length === 0 ? (
          <p className="rounded border bg-gray-50 py-8 text-center text-lg text-gray-500 shadow-sm">
            אין משחקים בהמתנה
          </p>
        ) : (
          <div className="space-y-4">
            {pendingGames.map((game, index) => (
              <ExpandableGameCard
                key={index}
                game={game}
                buttonTitle="לעמוד המשחק"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
