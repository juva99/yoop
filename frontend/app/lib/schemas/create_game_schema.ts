import { z } from "zod";

import { City } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";

export const FormDataSchema = z.object({
  date: z.coerce.date().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare dates only
    return date >= today;
  }, "תאריך לא יכול להיות בעבר"),
  gameType: z.nativeEnum(GameType),
  city: z.nativeEnum(City),
  maxParticipants: z.coerce.number().min(2, "לפחות 2 משתתפים"),
  fieldName: z.string().nonempty("בחר מגרש"),
  startTime: z.string().nonempty("שעת התחלה נדרשת"),
  endTime: z.string().nonempty("שעת סיום נדרשת"),
});
