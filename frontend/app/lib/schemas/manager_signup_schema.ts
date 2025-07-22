import { z } from "zod";

export const formSchema = z.object({
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
  message: z
    .string()
    .min(10, "נא להוסיף לפחות 10 תווים")
    .max(500, "נא לא לעבור את 500 התווים"),
});
