import { GameType } from "@/app/enums/game-type.enum";
import { Game } from "@/app/types/Game";
import { CalendarEvent, ics } from "calendar-link";
import { FaRegCalendarPlus } from "react-icons/fa6";

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
${process.env.NEXT_PUBLIC_FRONTEND_URL}/game/${gameId}`,
    location: field.fieldAddress,
  };

  return (
    <a
      href={ics(calendarEvent)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-sm text-blue-500"
    >
      <>
        <FaRegCalendarPlus className="ml-2" />
        הוסף ליומן
      </>
    </a>
  );
};

export default CalendarLink;
