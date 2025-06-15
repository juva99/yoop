import { z } from "zod";
import { GameType } from "@/app/enums/game-type.enum";

export const formSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(2, { message: "שם הקבוצה חייב להכיל לפחות שתי אותיות" })
    .regex(/^[א-ת ]+$/, { message: "שם הקבוצה חייב להכיל אותיות בעברית בלבד" }),
  gameTypes: z
    .array(z.nativeEnum(GameType))
    .min(1, "יש לבחור לפחות סוג ספורט אחד"),
  userIds: z.array(z.string()).optional(),
  groupPicture: z.string().url().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const newGroupSchema = z.object({
  groupName: z.string().min(1, "שם הקבוצה הוא שדה חובה"),
  gameTypes: z.nativeEnum(GameType, {
    errorMap: () => ({ message: "יש לבחור סוג משחק" }),
  }),
  userIds: z.array(z.string()).optional(),
  groupPicture: z.string().url().optional(),
});

export type NewGroupFormValues = z.infer<typeof newGroupSchema>;
