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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-10">
        <p className="mb-4 text-right text-2xl font-bold">משחקים בניהולך</p>
        <div className="space-y-4">
          {games
            .filter((game) => game.creator.uid === currUserUID)
            .map((game, index) => (
              <ExpandableGameCard key={index} game={game} buttonTitle="לעמוד המשחק" />
            ))}
        </div>
      </div>
      <div className="mb-10">
        <p className="mb-4 text-right text-2xl font-bold">המשחקים שלי</p>
        <div className="space-y-4">
          {games
            .filter((game) =>
              game.gameParticipants.some(
                (gp) =>
                  gp.user.uid === currUserUID &&
                  gp.status === ParticipationStatus.APPROVED,
              ),
            )
            .map((game, index) => (
              <ExpandableGameCard key={index} game={game} buttonTitle="לעמוד המשחק" />
            ))}
        </div>
      </div>
      <div>
        <p className="mb-4 text-right text-2xl font-bold">משחקים בהמתנה</p>
        <div className="space-y-4">
          {games
            .filter((game) =>
              game.gameParticipants.some(
                (gp) =>
                  gp.user.uid === currUserUID &&
                  gp.status === ParticipationStatus.PENDING,
              ),
            )
            .map((game, index) => (
              <ExpandableGameCard key={index} game={game} buttonTitle="לעמוד המשחק" />
            ))}
        </div>
      </div>
    </div>
  );
}
