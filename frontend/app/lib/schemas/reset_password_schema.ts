import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    pass: z
      .string()
      .trim()
      .min(8, { message: "לפחות 8 תווים" })
      .regex(/[a-zA-Z]/, { message: "אותיות גדולות וקטנות באנגלית" })
      .regex(/[0-9]/, { message: "לפחות מספר אחד" })
      .regex(/[^a-zA-Z0-9]/, { message: "לפחות תו מיוחד אחד" }),
    passConfirm: z.string().trim().min(8, { message: "לפחות 8 תווים" }),
  })
  .refine((data) => data.pass === data.passConfirm, {
    message: "הסיסמאות אינן תואמות",
    path: ["passConfirm"], // path of error
  });

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
