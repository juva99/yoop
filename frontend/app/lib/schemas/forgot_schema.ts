import { z } from "zod";

const forgotSchema = z.object({
  userEmail: z
    .string()
    .min(1, { message: "חובה למלא אימייל" })
    .email({ message: "אימייל לא תקין" }),
});

type ForgotSchema = z.infer<typeof forgotSchema>;

const formDefaultValues: ForgotSchema = {
  userEmail: "example@email.com",
};

export { forgotSchema, formDefaultValues, type ForgotSchema };
