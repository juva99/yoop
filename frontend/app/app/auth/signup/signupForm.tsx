"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema } from "@/lib/schemas/signup_schema";
import { z } from "zod";
import { signup } from "@/lib/auth";
import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { TbEyeOff } from "react-icons/tb";
import { TbEyeCheck } from "react-icons/tb";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { City } from "@/app/enums/city.enum";

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

const cityOptions = Object.values(City).map((value) => ({
  label: value,
  value: value,
}));

const SignupForm = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userEmail: "",
      pass: "",
      passConfirm: "",
      phoneNum: "",
      birthDay: "",
      address: "" as City,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      const result = await signup(values);

      if (result?.error) {
        toast.error(result.message || "שגיאה בהרשמה");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>שם פרטי</FormLabel>
              <FormControl>
                <Input placeholder="הכנס שם פרטי" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>שם משפחה</FormLabel>
              <FormControl>
                <Input placeholder="הכנס שם משפחה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>אימייל</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pass"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>סיסמא</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <TbEyeCheck /> : <TbEyeOff />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passConfirm"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>אימות סיסמא</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNum"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>טלפון</FormLabel>
              <FormControl>
                <Input placeholder="050-1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDay"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>תאריך לידה</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex w-full cursor-pointer justify-start pl-3 font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {field.value
                        ? format(new Date(field.value), "dd/MM/yyyy", {
                            locale: he,
                          })
                        : "בחר תאריך"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(
                        date
                          ? (date.setHours(10), date.toISOString().slice(0, 10))
                          : "",
                      )
                    }
                    locale={he}
                    disabled={(date) =>
                      date >= new Date(new Date().toDateString()) ||
                      date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>יישוב</FormLabel>
              <FormControl>
                <Combobox
                  options={cityOptions}
                  value={field.value}
                  onSelect={field.onChange}
                  placeholder="בחר עיר"
                  searchPlaceholder="חפש עיר..."
                  notFoundText="לא נמצאה עיר"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button type="submit" variant={"submit"} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                נרשם...
              </div>
            ) : (
              "הירשם"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
