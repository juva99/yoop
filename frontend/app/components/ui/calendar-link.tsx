import { GameType } from "@/app/enums/game-type.enum";
import { Game } from "@/app/types/Game";
import { FRONTEND_URL } from "@/lib/constants";
import { CalendarEvent, ics } from "calendar-link";
import { FaCalendarPlus } from "react-icons/fa6";

type Props = {
  game: Game;
};

const CalendarLink: React.FC<Props> = ({ game }) => {
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
    <a
      href={ics(calendarEvent)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex"
    >
      <FaCalendarPlus />
    </a>
  );
};

export default CalendarLink;
