import { z } from "zod";
import { Role } from "@/app/enums/role.enum";

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
          "מספר הטלפון חייב להיות באחד הפורמטים: 05X-1234567 , 05X1234567 , +9725X-1234567 , +9725X1234567",
      })
      .transform((val) => {
        const cleaned = val.replace(/-/g, "");
        return cleaned.startsWith("+972") ? "0" + cleaned.slice(4) : cleaned;
      }),

    address: z.string().min(1, { message: "יש לבחור עיר מגורים" }),

    birthDay: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "הכנס תאריך תקין (YYYY-MM-DD)" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "בבקשה הכנס תאריך תקין",
      }),

    role: z.literal(Role.USER),
  })
  .refine((data) => data.pass === data.passConfirm, {
    message: "הסיסמאות אינן מתאימות",
    path: ["passConfirm"],
  });

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
