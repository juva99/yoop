import { z } from "zod";

export type FormState =
  | {
      error?: {
        firstName?: string[];
        lastName?: string[];
        userEmail?: string[];
        pass?: string[];
        passConfirm?: string[];
        phoneNum?: string[];
        birthDay?: string[];
      };
      message?: string;
    }
  | undefined;

export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: "שם פרטי חייב להכיל לפחות שתי אותיות" })
      .regex(/^[א-ת]+$/, { message: "שם פרטי חייב להכיל אותיות בעברית" }),

    lastName: z
      .string()
      .trim()
      .min(2, { message: "שם משפחה חייב להכיל לפחות שתי אותיות" })
      .regex(/^[א-ת]+$/, { message: "שם משפחה חייב להכיל אותיות בעברית" }),
    userEmail: z
      .string()
      .trim()
      .email({ message: "בבקשה הכנס כתובת מייל תקינה" }),
    pass: z
      .string()
      .trim()
      .min(8, { message: "לפחות 8 תווים" })
      .regex(/[a-zA-Z]/, { message: "אותיות גדולות וקטנות באנגלית" })
      .regex(/[0-9]/, { message: "לפחות מספר אחד" })
      .regex(/[^a-zA-Z0-9]/, { message: "לפחות תו מיוחד אחד" }),
    passConfirm: z
      .string()
      .trim()
      .min(8, { message: "לפחות 8 תווים" })
      .regex(/[a-zA-Z]/, { message: "אותיות גדולות וקטנות באנגלית" })
      .regex(/[0-9]/, { message: "לפחות מספר אחד" })
      .regex(/[^a-zA-Z0-9]/, { message: "לפחות תו מיוחד אחד" }),
    phoneNum: z
      .string()
      .trim()
      .regex(/^(\+972|0)5\d(-?\d{7})$/, {
        message:
          "מספר הטלפון חייב להיות באחד הפורמטים: " +
          "05X-1234567 , 05X1234567 , +9725X-1234567 , +9725X1234567 ",
      })
      .transform((val) => {
        const cleaned = val.replace("/-", "");
        return cleaned.startsWith("+972") ? "0" + cleaned.slice(4) : cleaned;
      }),
    birthDay: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "הכנס תאריך תקין" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "בבקשה הכנס תאריך תקין",
      }),
    role: z.enum(["player"]),
  })
  .refine((data) => data.pass === data.passConfirm, {
    message: "הסיסמאות אינן מתאימות",
    path: ["passConfirm"], // path of error
  });

export const LoginFormSchema = z.object({
  userEmail: z
    .string()
    .trim()
    .email({ message: "בבקשה הכנס כתובת מייל תקינה" }),
  pass: z
    .string()
    .trim()
    .min(8, { message: "הסיסמא חייבת להכיל לפחות 8 תווים " }),
});
