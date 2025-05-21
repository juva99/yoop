// profile_update_schema.ts
import { z } from "zod";
import { City } from "@/app/enums/city.enum";

export const ProfileUpdateSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "שם פרטי חייב להכיל לפחות שתי אותיות" })
    .regex(/^[א-ת]+$/, { message: "שם פרטי חייב להכיל אותיות בעברית בלבד" }),

  lastName: z
    .string()
    .trim()
    .min(2, { message: "שם משפחה חייב להכיל לפחות שתי אותיות" })
    .regex(/^[א-ת]+$/, { message: "שם משפחה חייב להכיל אותיות בעברית בלבד" }),

  userEmail: z
    .string()
    .trim()
    .email({ message: "כתובת מייל לא תקינה" }),

  phoneNum: z
    .string()
    .trim()
    .regex(/^(\+972|0)5\d(-?\d{7})$/, {
      message:
        "מספר הטלפון חייב להיות באחד הפורמטים: " +
        "05X-1234567 , 05X1234567 , +9725X-1234567 , +9725X1234567",
    })
    .transform((val) => {
      const cleaned = val.replace(/-/g, "");
      return cleaned.startsWith("+972") ? "0" + cleaned.slice(4) : cleaned;
    }),

  birthDay: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "יש להזין תאריך בפורמט YYYY-MM-DD",
    })
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date < new Date();
    }, { message: "תאריך הלידה חייב להיות בעבר" }),

    address: z.nativeEnum(City),

});

export type ProfileUpdateFormValues = z.infer<typeof ProfileUpdateSchema>;
