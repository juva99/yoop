"use client";

import { UseFormReturn } from "react-hook-form";
import { City } from "@/app/enums/city.enum";
import { useEffect, useState } from "react";
import { Spinner } from "../../ui/spinner";
import { Combobox } from "../../ui/combobox";
import { authFetch } from "@/lib/authFetch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FieldInfoStepProps {
  form: UseFormReturn;
}

async function fetchFields(
  city: City,
): Promise<{ value: string; label: string }[]> {
  const city_key = Object.keys(City).find(
    (key) => City[key as keyof typeof City] === city,
  );

  const fieldsResponse = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/by-city?city=${city_key}`,
    { method: "GET" },
  );
  if (!fieldsResponse.ok) {
    throw new Error(`Failed to fetch fields: ${fieldsResponse.statusText}`);
  }
  const fieldsData: { fieldId: string; fieldName: string }[] =
    await fieldsResponse.json();
  return fieldsData.map((field) => ({
    value: field.fieldId,
    label: field.fieldName,
  }));
}

export default function FieldInfoStep({ form }: FieldInfoStepProps) {
  const city: City = form.watch("city");
  const [availableFields, setAvailableFields] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    fetchFields(city)
      .then((fields) => {
        setAvailableFields(fields);
      })
      .catch((error) => {
        console.error("Failed to fetch fields:", error);
        setAvailableFields([]);
      });
  }, [city]);

  return (
    <>
      {availableFields.length > 0 ? (
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מגרש</FormLabel>
              <FormControl>
                <Combobox
                  options={availableFields}
                  value={field.value}
                  onSelect={field.onChange}
                  placeholder="בחר מגרש"
                  searchPlaceholder="חפש מגרש..."
                  notFoundText="לא נמצא מגרש"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}
