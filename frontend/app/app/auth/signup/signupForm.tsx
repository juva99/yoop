import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SubmitButton from "@/components/ui/submitButton"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

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
  const [date, setDate] = useState<Date>()

  return (
    <form>
      <div className="form_item">
        <Label htmlFor="firstname" className="text-sm font-semibold text-gray-700 mb-1 block">שם פרטי</Label>
        <Input type="text" id="firstname" placeholder="הכנס שם פרטי" className="input_underscore"></Input>
      </div>
      <div className="form_item">
        <Label htmlFor="lastname" className="text-sm font-semibold text-gray-700 mb-1 block">שם משפחה</Label>
        <Input type="text" id="lastname" placeholder="הכנס שם משפחה" className="input_underscore"></Input>
      </div>
      <div className="form_item">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1 block">אימייל</Label>
        <Input type="email" id="email" placeholder="אימייל" className="input_underscore"></Input>
      </div>
      <div className="form_item">
        <HoverCard>
          <HoverCardTrigger>
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1 block">סיסמא</Label>
            <Input type="password" id="password" placeholder="••••••••" className="input_underscore"></Input>
          </HoverCardTrigger>
          <HoverCardContent>
            {passwordRequirements}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="form_item">
        <HoverCard>
          <HoverCardTrigger>
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 mb-1 block">הכנס שוב סיסמא</Label>
            <Input type="password" id="confirmPassword" placeholder="••••••••" className="input_underscore"></Input>
          </HoverCardTrigger>
          <HoverCardContent>
            {passwordRequirements}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="form_item">
        <Label htmlFor="phoneNum" className="text-sm font-semibold text-gray-700 mb-1 block">מספר טלפון</Label>
        <Input type="tel" id="phoneNum" pattern="[0-9]{10}" placeholder="0501234567" className="input_underscore"></Input>
      </div>
      <div className="form_item">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full mt-3 justify-start text-left font-normal",
                "input_underscore",
                !date && "text-muted-foreground" 
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
      </div>
      <div className="flex justify-center w-full">
        <SubmitButton
          className="mt-3 px-5 py-5 rounded-sm bg-blue-500  text-white text-lg font-semibold"
        >
           הירשם עכשיו
        </SubmitButton>
      </div>
  </form>
  )
}

export default SignupForm;