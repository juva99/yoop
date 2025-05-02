// frontend/app/app/createGame/Server/index.ts

// In-memory mock database
const games: Game[] = [];

export interface Game {
  id: string;
  date: string;
  type: string;
  time: [number, number]; // [startHour, endHour]
  lat: number;
  lon: number;
}

// Utility: Check if time ranges overlap
function timeRangesOverlap(a: [number, number], b: [number, number]): boolean {
  return a[0] < b[1] && b[0] < a[1];
}

// API handler simulation
export function createGameOnServer(data: Omit<Game, "id">): { id?: string; message?: string } {
  const { date, type, time, lat, lon } = data;

  // Check for overlapping games on same date, type, and location
  const conflict = games.find(
    (game) =>
      game.date === date &&
      game.type === type &&
      game.lat === lat &&
      game.lon === lon &&
      timeRangesOverlap(game.time, time)
  );

  if (conflict) {
    return { message: "משחק כבר קיים בשעות האלו. אנא בחר שעה אחרת." };
  }

  // If no conflict, create new game
  const id = `game-${Math.floor(Math.random() * 100000)}`;
  games.push({ id, date, type, time, lat, lon });
  console.log("✅ Game added:", { id, date, type, time, lat, lon });
  console.log("📦 All games:", games);
  return { id };
}
