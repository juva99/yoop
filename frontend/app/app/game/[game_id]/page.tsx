import { PiBasketball, PiSoccerBall, PiCalendarDots } from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { IoMdPin } from "react-icons/io";
import { Game } from "@/app/types/Game";
import PlayersList from "@/components/friends/PlayersList";
import MapView from "@/components/games/MapView";
import { notFound } from "next/navigation";
import { GameType } from "@/app/enums/game-type.enum";
import { getSession } from "@/lib/session";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import LeaveGameButton from "@/components/games/LeaveGameButton";
import { authFetch } from "@/lib/authFetch";
import CalendarLink from "@/components/ui/calendar-link";
import Share from "@/components/ui/share";
import { getMyFriends, getMyGroups } from "@/lib/actions";
import InviteDialog from "@/components/friends/InviteDialog";
import { GameStatus } from "@/app/enums/game-status.enum";
import RegStatus from "@/components/games/RegStatus";
import JoinGameButton from "@/components/games/JoinGameButton";

enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  FINISHED = "FINISHED",
  STARTED = "STARTED",
}

async function getGame(gameId: string): Promise<Game | null> {
  try {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/byid/${gameId}`,
      {},
    );
    if (!res.ok) {
      if (res.status === 404) {
        // Game not found
        return null;
      }
      console.error(
        `Failed to fetch game ${gameId}: ${res.status} ${res.statusText}`,
      );
    }

    const gameData = await res.json();
    return gameData as Game;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
}

const isFinished = (game: Game): boolean => {
  const now = new Date();
  const endDate = new Date(game.endDate);
  return endDate < now;
};

const isStarted = (game: Game): boolean => {
  const now = new Date();
  const startDate = new Date(game.startDate);
  return startDate <= now && !isFinished(game);
};

export default async function Page({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) {
  const { game_id } = await params;
  const game = await getGame(game_id);
  if (!game) {
    notFound();
  }

  // Destructure fetched game data
  const {
    gameId,
    gameType,
    startDate,
    endDate,
    maxParticipants,
    status,
    gameParticipants,
    creator,
    field,
    price,
    weatherTemp,
    weatherIcon,
  } = game;
  const friends = await getMyFriends();
  const groups = await getMyGroups();
  // Ensure dates are Date objects if they aren't already (TypeORM might return strings)
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedDate = start.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  });

  const formattedStartTime = start.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jerusalem",
  });

  const formattedEndTime = end.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jerusalem",
  });

  const session = await getSession();
  const currUserUID = session!.user.uid;
  const isCreator = currUserUID === game.creator.uid;
  const approvedCount = gameParticipants.filter(
    (gp) => gp.status === ParticipationStatus.APPROVED,
  ).length;

  let isJoined = false;
  let isApproved = false;

  for (const gp of gameParticipants) {
    if (gp.user.uid === currUserUID) {
      if (gp.status !== ParticipationStatus.REJECTED) isJoined = true;
      if (gp.status === ParticipationStatus.APPROVED) isApproved = true;
      break; // No need to check further
    }
  }

  const playersInGame = gameParticipants
    .filter((gp) => gp.status === ParticipationStatus.APPROVED)
    .map((gp) => gp.user.uid);

  const regStatus: Status = isStarted(game)
    ? Status.STARTED
    : isFinished(game)
      ? Status.FINISHED
      : status === GameStatus.APPROVED
        ? Status.APPROVED
        : Status.PENDING;

  const showActions =
    regStatus === Status.APPROVED || regStatus === Status.PENDING;
  return (
    <div className="min-h-screen justify-center bg-gray-50 pb-8">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header Card */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="rounded-ful flex h-12 w-12 items-center justify-center">
                  {gameType === GameType.BasketBall ? (
                    <PiBasketball className="h-10 w-10" />
                  ) : gameType === GameType.FootBall ? (
                    <PiSoccerBall className="h-10 w-10" />
                  ) : null}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    משחק{" "}
                    {gameType === GameType.BasketBall ? "כדורסל" : "כדורגל"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    נוצר על ידי {creator.firstName} {creator.lastName}
                  </p>
                </div>
              </div>
            </div>
            {regStatus === Status.APPROVED && (
              <div className="flex flex-shrink-0 flex-col items-center gap-2">
                <div className="scale-110">
                  <Share />
                </div>
                {isApproved && (
                  <div className="scale-110">
                    <CalendarLink game={game} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {regStatus === Status.PENDING && (
              <RegStatus text="הרשמה עדיין לא נפתחה" icon={<span>🟠</span>} />
            )}
            {regStatus === Status.APPROVED && (
              <RegStatus text="פתוח להרשמה" icon={<span>🟢</span>} />
            )}
            {regStatus === Status.STARTED && (
              <RegStatus text="ההרשמה סגורה" icon={<span>🔴</span>} />
            )}
            {regStatus === Status.FINISHED && (
              <RegStatus text="המשחק הסתיים" icon={<span>🔴</span>} />
            )}
          </div>

          {/* Game Details Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <IoMdPin className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{field.fieldName}</p>
                <p className="text-sm text-gray-600">{field.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <PiCalendarDots className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{formattedDate}</p>
                <p className="text-sm text-gray-600">
                  {formattedStartTime} - {formattedEndTime}
                </p>
              </div>
            </div>

            {weatherTemp && (
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <TiWeatherPartlySunny className="h-5 w-5 text-gray-600" />
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{weatherTemp}°</p>
                  <img
                    src={weatherIcon}
                    alt="Weather Icon"
                    className="h-6 w-6"
                  />
                </div>
              </div>
            )}
            {showActions && (
              <div className="bottom-4 mx-auto flex w-40 rounded-lg">
                {!isJoined ? (
                  <JoinGameButton gameId={gameId} />
                ) : (
                  <LeaveGameButton
                    gameId={gameId}
                    text={
                      isCreator && game.gameParticipants.length === 1
                        ? "מחק משחק"
                        : "עזוב משחק"
                    }
                    isCreator={isCreator}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Participants Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              משתתפים ({approvedCount}/{maxParticipants})
            </h2>
            {regStatus === Status.APPROVED && isCreator && (
              <InviteDialog
                gameId={gameId}
                friends={friends}
                groups={groups}
                playersInGame={playersInGame}
              />
            )}
          </div>
          <PlayersList
            gameId={gameId}
            creatorUID={creator.uid}
            currUserUID={currUserUID}
            gameParticipants={gameParticipants}
            status={ParticipationStatus.APPROVED}
            deleteEnable={true}
          />
        </div>

        {/* Waiting List Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            רשימת המתנה
          </h2>
          <PlayersList
            gameId={gameId}
            creatorUID={creator.uid}
            currUserUID={currUserUID}
            gameParticipants={gameParticipants}
            status={ParticipationStatus.PENDING}
            deleteEnable={true}
          />
        </div>

        {/* Map Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">מיקום</h2>
          <div className="overflow-hidden rounded-lg">
            <MapView
              defaultLocation={{ lng: field.fieldLng, lat: field.fieldLat }}
              games={[game]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
