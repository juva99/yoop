import { GameType } from "@/app/enums/game-type.enum";
import { Game } from "@/app/types/Game";
import { FRONTEND_URL } from "@/lib/constants";
import { CalendarEvent, google } from "calendar-link";

type Props = {
  game: Game;
};

const GoogleCalendarLink: React.FC<Props> = ({ game }) => {
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
  } = game;

  const calendarEvent: CalendarEvent = {
    title: `משחק ${gameType === GameType.FootBall ? "כדורגל" : "כדורסל"} ב-${field.fieldName}`,
    start: startDate,
    end: endDate,
    description: `לעוד פרטים על המשחק, לחץ כאן:
${FRONTEND_URL}/game/${gameId}`,
    location: field.fieldAddress,
  };

  return (
    <a href={google(calendarEvent)} target="_blank" rel="noopener noreferrer">
      <img
        src="/google-calendar.png"
        alt="Google Calendar Icon"
        width={35}
        height={35}
      />
    </a>
  );
};

export default GoogleCalendarLink;
