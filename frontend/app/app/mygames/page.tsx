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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-10">
        <p className="text-2xl font-bold mb-4 text-right">משחקים בניהולך</p>
        <div className="space-y-4">
          {games
            .filter(game =>
              game.creator.uid === currUserUID
            )
            .map((game, index) => (
              <ExpandableGameCard key={index} game={game} />
            ))
          }
        </div>
      </div>
      <div className="mb-10">
        <p className="text-2xl font-bold mb-4 text-right">המשחקים שלי</p>
        <div className="space-y-4">
          {games
            .filter(game =>
              game.gameParticipants.some(
                gp =>
                  gp.user.uid === currUserUID &&
                  gp.status === ParticipationStatus.APPROVED
              )
            )
            .map((game, index) => (
              <ExpandableGameCard key={index} game={game} />
            ))
          }
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold mb-4 text-right">משחקים בהמתנה</p>
        <div className="space-y-4">
          {games
            .filter(game =>
              game.gameParticipants.some(
                gp =>
                  gp.user.uid === currUserUID &&
                  gp.status === ParticipationStatus.PENDING
              )
            )
            .map((game, index) => (
              <ExpandableGameCard key={index} game={game} />
            ))
          }
        </div>
      </div>
    </div>
  )

}
