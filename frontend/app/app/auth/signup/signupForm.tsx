"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useActionState, useState, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submitButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { he } from "date-fns/locale";

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

// still need to make a final list of cities
const cities = [
  { value: "תל אביב", label: "תל אביב" },
  { value: "ירושלים", label: "ירושלים" },
  { value: "חיפה", label: "חיפה" },
  { value: "באר שבע", label: "באר שבע" },
  { value: "ראשון לציון", label: "ראשון לציון" },
];

const SignupForm = () => {
  const [birthDay, setBirthDay] = useState<Date>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);

  const [state, action] = useActionState(signup, undefined);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  // Define year range for the dropdowns
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 100;
  const toYear = currentYear;

  return (
    <form action={action}>
      {state?.message && <p className="form_error">{state.message}</p>}

      <div className="form_item">
        <Label htmlFor="firstName" className="form_label">
          שם פרטי
        </Label>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="הכנס שם פרטי"
          className="input_underscore"
          value={firstName}
          onChange={handleInputChange(setFirstName)}
        ></Input>
      </div>
      {state?.error?.firstName && (
        <div className="form_error">
          <ul>
            {state.error.firstName.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form_item">
        <Label htmlFor="lastName" className="form_label">
          שם משפחה
        </Label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="הכנס שם משפחה"
          className="input_underscore"
          value={lastName}
          onChange={handleInputChange(setLastName)}
        ></Input>
      </div>
      {state?.error?.lastName && (
        <div className="form_error">
          <ul>
            {state.error.lastName.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form_item">
        <Label htmlFor="userEmail" className="form_label">
          אימייל
        </Label>
        <Input
          type="email"
          id="userEmail"
          name="userEmail"
          placeholder="example@email.com"
          className="input_underscore"
          value={userEmail}
          onChange={handleInputChange(setUserEmail)}
        ></Input>
      </div>
      {state?.error?.userEmail && (
        <p className="form_error">{state.error.userEmail}</p>
      )}

      <div className="form_item">
        <HoverCard>
          <HoverCardTrigger>
            <Label htmlFor="pass" className="form_label">
              סיסמא
            </Label>
            <Input
              type="password"
              id="pass"
              name="pass"
              placeholder="••••••••"
              className="input_underscore"
              value={pass}
              onChange={handleInputChange(setPass)}
            ></Input>
          </HoverCardTrigger>
          <HoverCardContent>{passwordRequirements}</HoverCardContent>
        </HoverCard>
      </div>
      {state?.error?.pass && (
        <div className="form_error">
          <p>הסיסמא חייבת להכיל:</p>
          <ul>
            {state.error.pass.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form_item">
        <HoverCard>
          <HoverCardTrigger>
            <Label htmlFor="passConfirm" className="form_label">
              הכנס שוב סיסמא
            </Label>
            <Input
              type="password"
              id="passConfirm"
              name="passConfirm"
              placeholder="••••••••"
              className="input_underscore"
              value={passConfirm}
              onChange={handleInputChange(setPassConfirm)}
            ></Input>
          </HoverCardTrigger>
          <HoverCardContent>{passwordRequirements}</HoverCardContent>
        </HoverCard>
      </div>
      {state?.error?.passConfirm && (
        <div className="form_error">
          {state.error.passConfirm.includes("הסיסמאות אינן מתאימות") && (
            <p className="font-semibold">הסיסמאות אינן מתאימות</p>
          )}
          <p> הסיסמא חייבת להכיל:</p>
          <ul>
            {state.error.passConfirm
              .filter((error) => error !== "הסיסמאות אינן מתאימות")
              .map((error) => (
                <li key={error}>{error}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="form_item">
        <Label htmlFor="phoneNum" className="form_label">
          מספר טלפון
        </Label>
        <Input
          type="tel"
          id="phoneNum"
          name="phoneNum"
          placeholder="050-1234567"
          className="input_underscore"
          value={phoneNum}
          onChange={handleInputChange(setPhoneNum)}
        ></Input>
      </div>
      {state?.error?.phoneNum && (
        <p className="form_error">{state.error.phoneNum}</p>
      )}

      <div className="form_item">
        <Label htmlFor="address" className="form_label">
          עיר מגורים
        </Label>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCombobox}
              className="input_underscore w-full justify-between"
              id="address"
            >
              {selectedCity
                ? cities.find((city) => city.value === selectedCity)?.label
                : "בחר עיר..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="חיפוש עיר..." />
              <CommandList>
                <CommandEmpty>לא נמצאה עיר.</CommandEmpty>
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem
                      key={city.value}
                      value={city.value}
                      onSelect={(currentValue) => {
                        setSelectedCity(
                          currentValue === selectedCity ? "" : currentValue,
                        );
                        setOpenCombobox(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCity === city.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {city.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <input type="hidden" name="address" value={selectedCity} />
      </div>

      <div className="form_item">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "mt-3 w-full justify-start text-left font-normal",
                "input_underscore",
                !birthDay && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDay ? format(birthDay, "PPP") : <span>בחר תאריך לידה</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={birthDay}
              onSelect={setBirthDay}
              locale={he}
              captionLayout="dropdown-buttons"
              fromYear={fromYear}
              toYear={toYear}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name="birthDay"
          value={birthDay ? birthDay.toISOString().slice(0, 10) : ""}
        />
      </div>
      {state?.error?.birthDay && (
        <p className="form_error">{state.error.birthDay[0]}</p>
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
