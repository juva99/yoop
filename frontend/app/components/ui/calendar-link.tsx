"use client";

import { GameType } from "@/app/enums/game-type.enum";
import { Game } from "@/app/types/Game";
import { CalendarEvent, ics } from "calendar-link";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Button } from "./button";

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
    <div>
      <Button asChild variant={"ghost"} className="relative has-[>svg]:px-0">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <FaRegCalendarPlus className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

export default CalendarLink;
