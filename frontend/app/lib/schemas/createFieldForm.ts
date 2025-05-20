import { City } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { z } from "zod";

const fieldInfoSchema = z.object({
  gameType: z
    .array(z.nativeEnum(GameType))
    .min(1, "יש לבחור לפחות סוג משחק אחד"),
});

const fieldDataSchema = z
  .discriminatedUnion("hasMultipleFields", [
    z.object({
      hasMultipleFields: z.literal(false),
      fieldInfo: fieldInfoSchema,
    }),
    z.object({
      hasMultipleFields: z.literal(true),
      numberOfFields: z.number().min(2, "יש להזין לפחות שני מגרשים"),
      fields: z.array(fieldInfoSchema),
    }),
  ])
  .refine(
    (data) =>
      data.hasMultipleFields
        ? data.fields.length === data.numberOfFields
        : true,
    {
      message: "מספר המגרשים חייב להתאים למספר שהוזן",
      path: ["numberOfFields"],
    },
  );

const formSchema = z
  .object({
    fieldName: z.string().min(1, "שם המגרש הוא שדה חובה"),
    fieldLat: z.number(),
    fieldLng: z.number(),
    city: z.nativeEnum(City),
    fieldAddress: z.optional(z.string()),
  })
  .and(fieldDataSchema);

type FormSchema = z.infer<typeof formSchema>;

const formDefaultValues: FormSchema = {
  fieldName: "",
  fieldLat: 0,
  fieldLng: 0,
  city: City.TEL_AVIV_YAFO,
  hasMultipleFields: false,
  fieldInfo: {
    gameType: [],
  },
};

export { formSchema, formDefaultValues, type FormSchema };
