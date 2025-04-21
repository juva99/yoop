"use client";

import { useFormState } from "react-dom";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submitButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { signup } from "@/lib/auth";

const passwordRequirements = (
  <div className="flex flex-col gap-2 p-2">
    <div className="font-semibold text-gray-700">הסיסמא חייבת להכיל:</div>
    <ul className="space-y-1 text-sm text-gray-600">
      <li className="flex items-center">
        <span className="ml-2 text-blue-500">•</span>
        לפחות 8 תווים
      </li>
      <li className="flex items-center">
        <span className="ml-2 text-blue-500">•</span>
        אותיות גדולות וקטנות באנגלית
      </li>
      <li className="flex items-center">
        <span className="ml-2 text-blue-500">•</span>
        לפחות מספר אחד
      </li>
      <li className="flex items-center">
        <span className="ml-2 text-blue-500">•</span>
        לפחות תו מיוחד אחד
      </li>
    </ul>
  </div>
);

const SignupForm = () => {
  const [date, setDate] = useState<Date>();
  const [state, action] = useFormState(signup, undefined);

  return (
    <form action={action}>
      {state?.message && <p className="form_error">{state.message}</p>}

      <div className="form_item">
        <Label
          htmlFor="firstName"
          className="form_label"
        >
          שם פרטי
        </Label>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="הכנס שם פרטי"
          className="input_underscore"
        ></Input>
      </div>
      {state?.error?.firstName && (
        <p className="form_error">{state.error.firstName}</p>
      )}

      <div className="form_item">
        <Label
          htmlFor="lastName"
          className="form_label"
        >
          שם משפחה
        </Label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="הכנס שם משפחה"
          className="input_underscore"
        ></Input>
      </div>
      {state?.error?.lastName && (
        <p className="form_error">{state.error.lastName}</p>
      )}

      <div className="form_item">
        <Label
          htmlFor="email"
          className="form_label"
        >
          אימייל
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          className="input_underscore"
        ></Input>
      </div>
      {state?.error?.email && <p className="form_error">{state.error.email}</p>}

      <div className="form_item">
        <HoverCard>
          <HoverCardTrigger>
            <Label
              htmlFor="password"
              className="form_label"
            >
              סיסמא
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="input_underscore"
            ></Input>
          </HoverCardTrigger>
          <HoverCardContent>{passwordRequirements}</HoverCardContent>
        </HoverCard>
      </div>
      {state?.error?.password && (
        <div className="form_error">
          <p>הסיסמא חייבת להכיל:</p>
          <ul>
            {state.error.password.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form_item">
        <HoverCard>
          <HoverCardTrigger>
            <Label
              htmlFor="confirmPassword"
              className="form_label"
            >
              הכנס שוב סיסמא
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              className="input_underscore"
            ></Input>
          </HoverCardTrigger>
          <HoverCardContent>{passwordRequirements}</HoverCardContent>
        </HoverCard>
      </div>
      {state?.error?.confirmPassword && (
        <div className="form_error">
          {state.error.confirmPassword.includes("הסיסמאות אינן מתאימות") && (
            <p className="font-semibold">הסיסמאות אינן מתאימות</p>
          )}
          <p> הסיסמא חייבת להכיל:</p>
          <ul>
            {state.error.confirmPassword
              .filter((error) => error !== "הסיסמאות אינן מתאימות")
              .map((error) => (
                <li key={error}>{error}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="form_item">
        <Label
          htmlFor="phoneNum"
          className="form_label"
        >
          מספר טלפון
        </Label>
        <Input
          type="tel"
          id="phoneNum"
          name="phoneNum"
          placeholder="050-1234567"
          className="input_underscore"
        ></Input>
      </div>
      {state?.error?.phoneNum && (
        <p className="form_error">{state.error.phoneNum}</p>
      )}

      <div className="form_item">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "mt-3 w-full justify-start text-left font-normal",
                "input_underscore",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>בחר תאריך לידה</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name="date"
          value={date ? date.toISOString().slice(0, 10) : ""}
        />
      </div>
      {state?.error?.date && (
        <p className="form_error">{state.error.date[0]}</p>
      )}

      <div className="flex w-full justify-center">
        <SubmitButton className="mt-3 rounded-sm bg-blue-500 px-5 py-5 text-lg font-semibold text-white">
          הירשם עכשיו
        </SubmitButton>
      </div>
    </form>
  );
};

export default SignupForm;
