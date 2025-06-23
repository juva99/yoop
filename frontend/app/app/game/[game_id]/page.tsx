import {
  PiBasketball,
  PiSoccerBall,
  PiCoins,
  PiCalendarDots,
  PiClock,
} from "react-icons/pi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { IoMdPin } from "react-icons/io";
import { Game } from "@/app/types/Game";
import PlayersList from "@/components/PlayersList";
import MapView from "@/components/MapView";
import { notFound } from "next/navigation"; // Import notFound
import { GameType } from "@/app/enums/game-type.enum";
import { getSession } from "@/lib/session";
import JoinGameButton from "@/components/JoinGameButton";
import { ParticipationStatus } from "@/app/enums/participation-status.enum";
import LeaveGameButton from "@/components/LeaveGameButton";
import { authFetch } from "@/lib/authFetch";
import CalendarLink from "@/components/ui/calendar-link";
import Share from "@/components/ui/share";
import { getMyFriends, getMyGroups } from "@/lib/actions";
import InviteDialog from "@/components/InviteDialog";
import { GameStatus } from "@/app/enums/game-status.enum";
import { is } from "date-fns/locale";
import RegStatus from "@/components/games/RegStatus";

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
  });
  const formattedTime = start.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedEndTime = end.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const session = await getSession();
  const currUserUID = session!.user.uid;
  const isCreator = currUserUID === game.creator.uid;
  const approvedCount = gameParticipants.filter(
    (gp) => gp.status === ParticipationStatus.APPROVED,
  ).length;

  const isJoined = gameParticipants.some(
    (gp) =>
      gp.user.uid === currUserUID && gp.status !== ParticipationStatus.REJECTED,
  );

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
    <div className="flex h-full flex-col gap-6 px-6">
      {" "}
      <div className="text-title flex items-center gap-3 text-2xl font-bold">
        <span>
          {" "}
          {gameType === GameType.BasketBall ? (
            <PiBasketball />
          ) : gameType === GameType.FootBall ? (
            <PiSoccerBall />
          ) : null}
        </span>
        <span>{`משחק ${gameType === GameType.BasketBall ? "כדורסל" : "כדורגל"} `}</span>{" "}
      </div>
      <div className="flex flex-col gap-2">
        {" "}
        <div className="flex items-center gap-2">
          <IoMdPin className="text-gray-600" />
          <p>
            {field.fieldName}, {field.city}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PiCalendarDots className="text-gray-600" />
          <p>{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <PiClock className="text-gray-600" />
          <p>
            {formattedTime}-{formattedEndTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TiWeatherPartlySunny />
          {weatherTemp && (
            <div className="flex items-center gap-0">
              <p>{weatherTemp}°</p>
              <img src={weatherIcon} alt="Weather Icon" className="h-6 w-6" />
            </div>
          )}
        </div>
        {price !== undefined && (
          <div className="flex items-center gap-2">
            <PiCoins className="text-gray-600" />
            <p>{price === null ? "חינם" : `${price} ₪`}</p>{" "}
          </div>
        )}
        {regStatus === Status.PENDING && (
          <RegStatus text="הרשמה עדייו לא נפתחה" icon={<span>🟠</span>} />
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
        <div className="flex items-center gap-2">
          <CalendarLink game={game} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3>
            משתתפים ({approvedCount}/{maxParticipants})
          </h3>
          {regStatus === Status.APPROVED && (
            <div className="flex items-center gap-4">
              {isCreator && (
                <InviteDialog
                  gameId={gameId}
                  friends={friends}
                  groups={groups}
                  playersInGame={playersInGame}
                />
              )}
              <Share />
            </div>
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
      <div>
        <div className="flex items-center justify-between">
          <h3>רשימת המתנה</h3>
        </div>

        <PlayersList
          gameId={gameId}
          creatorUID={creator.uid}
          currUserUID={currUserUID}
          gameParticipants={gameParticipants}
          status={ParticipationStatus.PENDING}
          deleteEnable={true}
        />
      </div>
      <div>
        <h3>מיקום</h3>
        <MapView
          defaultLocation={{ lng: field.fieldLng, lat: field.fieldLat }}
          games={[game]}
        />
      </div>
      {!isJoined && showActions && (
        <div className="mt-4 flex justify-center gap-4">
          <JoinGameButton gameId={gameId} />
        </div>
      )}
      {isJoined && showActions && (
        <div className="mt-4 flex justify-center gap-4">
          <LeaveGameButton
            gameId={gameId}
            text={
              isCreator && game.gameParticipants.length === 1
                ? "מחק משחק"
                : "עזוב משחק"
            }
            isCreator={isCreator}
          />
        </div>
      )}
    </div>
  );
}
