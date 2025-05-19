"use client";

import { City } from "@/app/enums/city.enum";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  formDefaultValues,
  formSchema,
  FormSchema,
} from "@/lib/schemas/createFieldForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";

const CreateFieldForm = () => {
  const form = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const [hasMultipleFields, setHasMultipleFields] = useState(false);

  // Field array for managing multiple fields
  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control: form.control,
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
    // Handle form submission - API call etc.
  };

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

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-2 text-center text-2xl font-bold">Create Field</h1>
      <p className="mb-8 text-center text-gray-600">
        Add your field details below
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter field name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fieldLat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
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
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Map component placeholder - you might want to add an actual map component here */}
          <div className="flex h-64 items-center justify-center rounded-md bg-gray-100 text-gray-400">
            Map Component (Click to set location)
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(City).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fieldAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormDescription>
                  Additional address details if needed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasMultipleFields"
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4">
                <div className="mb-2">
                  <FormLabel className="text-base">Multiple Fields?</FormLabel>
                  <FormDescription>
                    Does this location have multiple fields?
                  </FormDescription>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      const boolValue = value === "true";
                      field.onChange(boolValue);
                      setHasMultipleFields(boolValue);
                    }}
                    defaultValue={field.value ? "true" : "false"}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!hasMultipleFields ? (
            <FormField
              control={form.control}
              name="fieldInfo.gameType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Types</FormLabel>
                  <FormDescription>
                    Select all game types that can be played on this field
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(GameType).map((type) => (
                      <FormItem
                        key={type}
                        className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3"
                      >
                        <FormLabel className="font-normal">{type}</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value?.includes(type)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              const updatedValue = checked
                                ? [...currentValue, type]
                                : currentValue.filter((val) => val !== type);
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    ))}
                  </div>
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
                    <FormLabel>Number of Fields</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="How many fields?"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                          handleNumberOfFieldsChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Field {index + 1}</h3>
                  <FormField
                    control={form.control}
                    name={`fields.${index}.gameType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Game Types</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.values(GameType).map((type) => (
                            <FormItem
                              key={type}
                              className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3"
                            >
                              <FormLabel className="font-normal">
                                {type}
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    const updatedValue = checked
                                      ? [...currentValue, type]
                                      : currentValue.filter(
                                          (val) => val !== type,
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </>
          )}

          <Button type="submit" className="w-full">
            Create Field
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateFieldForm;
