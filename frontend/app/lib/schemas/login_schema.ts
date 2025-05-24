// login_schema.ts
import { z } from "zod";

export const LoginFormSchema = z.object({
userEmail: z
    .string()
    .min(1, { message: "חובה למלא אימייל" })
    .email({ message: "אימייל לא תקין" }),
pass: z
    .string()
    .trim()
    .min(8, { message: "לפחות 8 תווים" })
    .regex(/[a-zA-Z]/, { message: "אותיות גדולות וקטנות באנגלית" })
    .regex(/[0-9]/, { message: "לפחות מספר אחד" })
    .regex(/[^a-zA-Z0-9]/, { message: "לפחות תו מיוחד אחד" }),});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
