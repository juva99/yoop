import { z } from "zod";

export const formSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: "שם פרטי חייב להכיל לפחות שתי אותיות" })
      .regex(/^[א-ת]+$/, { message: "שם משפחה חייב להכיל אותיות בעברית" }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: "שם משפחה חייב להכיל לפחות שתי אותיות" })
      .regex(/^[א-ת]+$/, { message: "שם משפחה חייב להכיל אותיות בעברית" }),
    email: z.string().trim().email({ message: "בבקשה הכנס כתובת מייל תקינה" }),
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
    hasCourt: z.literal(true, {
      errorMap: () => ({ message: "יש לאשר בעלות על מגרש" }),
    }),
    password: z
      .string()
      .trim()
      .min(8, { message: "לפחות 8 תווים" })
      .regex(/[a-zA-Z]/, { message: "אותיות גדולות וקטנות באנגלית" })
      .regex(/[0-9]/, { message: "לפחות מספר אחד" })
      .regex(/[^a-zA-Z0-9]/, { message: "לפחות תו מיוחד אחד" }),
    confirmPassword: z
      .string()
      .trim()
      .min(8, { message: "לפחות 8 תווים" })
      .regex(/[a-zA-Z]/, { message: "אותיות גדולות וקטנות באנגלית" })
      .regex(/[0-9]/, { message: "לפחות מספר אחד" })
      .regex(/[^a-zA-Z0-9]/, { message: "לפחות תו מיוחד אחד" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "הסיסמאות אינן מתאימות",
    path: ["passConfirm"], // path of error
  });
