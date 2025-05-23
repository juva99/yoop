"use client";

import { City, cityCoordinates } from "@/app/enums/city.enum";
import { GameType } from "@/app/enums/game-type.enum";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  formDefaultValues,
  formSchema,
  FormSchema,
} from "@/lib/schemas/createFieldForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react"; // Import useEffect
import GameTypeOption from "./game-type-option";
import { Combobox } from "../ui/combobox";
import { Map, Marker } from "pigeon-maps";
import { Switch } from "../ui/switch";

const cityOptions = Object.entries(City).map(([label, value]) => ({
  label: value,
  value: value,
}));

const CreateFieldForm = () => {
  const form = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const hasMultipleFields = useWatch({
    control: form.control,
    name: "hasMultipleFields",
  });

  const selectedCity = useWatch({
    control: form.control,
    name: "city",
  });

  // State for map marker position
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );
  // State for map center
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.78, 35.21]); // Default center (Israel)

  // Field array for managing multiple fields
  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control: form.control,
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
    // Handle form submission - API call etc.
  };

  // Update map center when selectedCity changes
  useEffect(() => {
    if (selectedCity && cityCoordinates[selectedCity as City]) {
      setMapCenter(cityCoordinates[selectedCity as City]);
      setMarkerPosition(null);
      form.setValue("fieldLat", 0);
      form.setValue("fieldLng", 0);
    } else {
      setMapCenter([31.78, 35.21]);
      setMarkerPosition(null);
      form.setValue("fieldLat", 0);
      form.setValue("fieldLng", 0);
    }
  }, [selectedCity, form]);

  // Add a new field when numberOfFields changes
  const handleNumberOfFieldsChange = (value: number) => {
    const currentFieldsCount = fields.length;
    if (value > currentFieldsCount) {
      // Add more fields
      for (let i = 0; i < value - currentFieldsCount; i++) {
        append({ gameType: [] });
      }
    } else if (value < currentFieldsCount) {
      // Remove excess fields
      for (let i = currentFieldsCount - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  // Handle map click to update lat/lng and marker
  const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
    const [lat, lng] = latLng;
    form.setValue("fieldLat", lat);
    form.setValue("fieldLng", lng);
    setMarkerPosition(latLng);
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1>יצירת מגרש</h1>
      <p className="mb-8 text-center text-gray-600">
        הוסף את פרטי המגרש שלך למטה
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם המגרש</FormLabel>
                <FormControl>
                  <Input placeholder="הכנס שם למגרש" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Combobox
            form={form}
            name="city"
            label="עיר"
            options={cityOptions}
            placeholder="בחר עיר"
            searchPlaceholder="חפש עיר..."
            notFoundText="לא נמצאה עיר"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fieldLat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קו רוחב</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="קו רוחב"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value);
                        field.onChange(value);
                        if (value !== undefined && markerPosition) {
                          setMarkerPosition([value, markerPosition[1]]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fieldLng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קו אורך</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="קו אורך"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value);
                        field.onChange(value);
                        if (value !== undefined && markerPosition) {
                          setMarkerPosition([markerPosition[0], value]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="h-64 overflow-hidden rounded-md">
            <Map
              key={mapCenter.join("-")} // Add key to force re-render on center change if needed
              height={256}
              center={mapCenter} // Use center prop for dynamic centering
              defaultZoom={10} // Or manage zoom level in state as well
              onClick={handleMapClick}
            >
              {markerPosition && <Marker width={50} anchor={markerPosition} />}
            </Map>
            <p className="mt-1 text-center text-sm text-gray-500">
              לחץ על המפה כדי לבחור מיקום או בחר עיר להתמקדות
            </p>
          </div>

          <FormField
            control={form.control}
            name="fieldAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>כתובת (אופציונלי)</FormLabel>
                <FormControl>
                  <Input placeholder="כתובת רחוב" {...field} />
                </FormControl>
                <FormDescription>פרטי כתובת נוספים במידת הצורך</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasMultipleFields"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">מספר מגרשים?</FormLabel>
                  <FormDescription>האם יש במתחם מספר מגרשים?</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!hasMultipleFields ? (
            <FormField
              control={form.control}
              name="fieldInfo.gameType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>איזה סוג הוא?</FormLabel>
                  <FormDescription>
                    בחר את סוג המשחק שניתן לשחק במגרש זה
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.values(GameType).map((type) => (
                        <GameTypeOption
                          key={type}
                          value={type}
                          selected={field.value?.includes(type)}
                          onSelect={() => {
                            const currentValue = field.value || [];
                            let updatedValue;

                            if (currentValue.includes(type)) {
                              updatedValue = currentValue.filter(
                                (val) => val !== type,
                              );
                            } else {
                              updatedValue = [...currentValue, type];
                            }

                            field.onChange(updatedValue);
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="numberOfFields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר מגרשים</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="כמה מגרשים?"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value);
                          field.onChange(value);
                          if (value) handleNumberOfFieldsChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">מגרש {index + 1}</h3>
                  <FormField
                    control={form.control}
                    name={`fields.${index}.fieldNameOptional`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם מגרש (אופציונלי)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="הכנס שם למגרש"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`fields.${index}.gameType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>איזה סוג הוא?</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.values(GameType).map((type) => (
                              <GameTypeOption
                                key={type}
                                value={type}
                                selected={field.value?.includes(type)}
                                onSelect={() => {
                                  const currentValue = field.value || [];
                                  let updatedValue;

                                  if (currentValue.includes(type)) {
                                    updatedValue = currentValue.filter(
                                      (val) => val !== type,
                                    );
                                  } else {
                                    updatedValue = [...currentValue, type];
                                  }

                                  field.onChange(updatedValue);
                                }}
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </>
          )}

          <Button type="submit" className="w-full">
            יצירת מגרש
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateFieldForm;
