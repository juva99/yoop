import { z } from "zod";
import { GameType } from "@/app/enums/game-type.enum";

export const formSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(2, { message: "שם הקבוצה חייב להכיל לפחות שתי אותיות" })
    .regex(/^[א-ת]+$/, { message: "שם הקבוצה חייב להכיל אותיות בעברית בלבד" }),
  gameType: z
    .array(z.nativeEnum(GameType))
    .min(1, "יש לבחור לפחות סוג ספורט אחד"),
  members: z.array(z.string()).optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const newGroupSchema = z.object({
  groupName: z.string().min(1, "שם הקבוצה הוא שדה חובה"),
  gameType: z.nativeEnum(GameType, {
    errorMap: () => ({ message: "יש לבחור סוג משחק" }),
  }),
  members: z.array(z.string()).optional(),
});

export type NewGroupFormValues = z.infer<typeof newGroupSchema>;
