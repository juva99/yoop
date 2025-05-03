import {
  PiBasketball,
  PiSoccerBall,
  PiCoins,
  PiCalendarDots,
  PiClock,
} from "react-icons/pi";
import { IoMdPin } from "react-icons/io";
import { Game } from "@/app/types/Game";
import PlayersList from "@/components/PlayersList";
import MapView from "@/components/MapView";
import { notFound } from "next/navigation"; // Import notFound
import { GameType } from "@/app/enums/game-type.enum";

async function getGame(gameId: string): Promise<Game | null> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/games/byid/${gameId}`,
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
    price, // Use optional price from fetched data
  } = game;

  // Ensure dates are Date objects if they aren't already (TypeORM might return strings)
  const start = new Date(startDate);
  const end = new Date(endDate);

  const users = gameParticipants.map((participant) => participant.user);

  const formattedDate = start.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = start.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  const formattedEndTime = end.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return (
    <div className="container mx-auto flex flex-col gap-6 p-4">
      {" "}
      <div className="flex items-center gap-3">
        <span className="text-3xl text-blue-500">
          {" "}
          {gameType.toLowerCase() === "basketball" ? (
            <PiBasketball />
          ) : gameType.toLowerCase() === "soccer" ? (
            <PiSoccerBall />
          ) : null}
        </span>
        <h1 className="text-2xl font-bold">{`משחק ${gameType === GameType.BasketBall ? "כדורסל" : "כדורגל"} ב${field.fieldName}`}</h1>{" "}
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
        {" "}
        <div className="flex items-center gap-2">
          <IoMdPin className="text-gray-600" />
          <p>
            {field.fieldName}, {field.fieldAddress ?? "כתובת לא זמינה"}
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
        {price !== undefined && (
          <div className="flex items-center gap-2">
            <PiCoins className="text-gray-600" />
            <p>{price === 0 ? "חינם" : `${price} ₪`}</p>{" "}
          </div>
        )}
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          משתתפים ({gameParticipants.length}/{maxParticipants})
        </h2>
        <PlayersList players={users} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">מיקום</h2>
        <MapView
          defaultLocation={{ lng: field.fieldLng, lat: field.fieldLat }}
          games={[game]}
        />
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {" "}
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          הצטרף למשחק
        </button>
      </div>
    </div>
  );
}
