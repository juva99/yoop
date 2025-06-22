"use client";

import { GameType } from "@/app/enums/game-type.enum";
import { Game } from "@/app/types/Game";
import { CalendarEvent, ics } from "calendar-link";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";

type Props = {
  game: Game;
};

const CalendarLink: React.FC<Props> = ({ game }) => {
  const [href, setHref] = useState("");

  useEffect(() => {
    const { gameType, startDate, endDate, field } = game;
    const calendarEvent: CalendarEvent = {
      title: `משחק ${gameType === GameType.FootBall ? "כדורגל" : "כדורסל"} ב-${field.fieldName}`,
      start: startDate,
      end: endDate,
      description: `לעוד פרטים על המשחק, לחץ כאן: ${window.location.href}`,
      location: field.fieldAddress,
    };
    setHref(ics(calendarEvent));
  }, [game]);

  return (
    <a
      href={href}
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
