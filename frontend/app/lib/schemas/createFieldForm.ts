import { City } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { z } from "zod";

const fieldInfoSchema = z.object({
  gameType: z
    .array(z.nativeEnum(GameType))
    .min(1, "At least one game type is required"),
});

const fieldDataSchema = z
  .discriminatedUnion("hasMultipleFields", [
    z.object({
      hasMultipleFields: z.literal(false),
      fieldInfo: fieldInfoSchema,
    }),
    z.object({
      hasMultipleFields: z.literal(true),
      numberOfFields: z.number().min(2, "At least one field is required"),
      fields: z.array(fieldInfoSchema),
    }),
  ])
  .refine(
    (data) =>
      data.hasMultipleFields
        ? data.fields.length === data.numberOfFields
        : true,
    {
      message: "The number of fields must match the specified count.",
      path: ["fields"], // Or "numberOfFields" depending on where you want the error to appear
    },
  );

const formSchema = z
  .object({
    fieldName: z.string().min(1, "Field name is required"),
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
  city: City.TEL_AVIV_YAFO, // Replace 'City.DEFAULT' with an appropriate default value from the City enum
  hasMultipleFields: false,
  fieldInfo: {
    gameType: [],
  },
};

export { formSchema, formDefaultValues, type FormSchema };
