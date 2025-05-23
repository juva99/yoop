import { City } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { z } from "zod";

const formSchema = z.object({
  city: z.nativeEnum(City),
  gameType: z.nativeEnum(GameType).optional(),
  date: z.date().optional(),
  timeRange: z.array(z.number()).length(2).default([9, 22]),
});

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  city: City.TEL_AVIV_YAFO,
  gameType: GameType.FootBall,
  date: undefined,
  timeRange: [9, 22],
};

export { formSchema, formDefaultValues, type FormSchema };
