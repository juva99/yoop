"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/types/User";
import { authFetch } from "@/lib/authFetch";

import {
  ProfileUpdateSchema,
  ProfileUpdateFormValues,
} from "@/lib/schemas/profile_update_schema";

import { City } from "@/app/enums/city.enum";

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
import { CalendarIcon, Pencil, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { he } from "date-fns/locale";
import { Combobox } from "../ui/combobox";
import { Role } from "@/app/enums/role.enum";

const cityOptions = Object.entries(City).map(([label, value]) => ({
  label: value,
  value: value,
}));

type Props = {
  user: User;
  role: Role;
};

const ProfileInfo: React.FC<Props> = ({ user, role }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  const isAdmin = role === Role.ADMIN || role === Role.FIELD_MANAGER;

  const defaultValues: ProfileUpdateFormValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    userEmail: user.userEmail || "",
    phoneNum: user.phoneNum || "",
    birthDay: user.birthDay
      ? new Date(user.birthDay).toISOString().split("T")[0]
      : "",
    address: (user.address as City) || "",
  };

  //----------בדיקה שלי----------//
  useEffect(() => {
    console.log("📥 נתוני התחלה בטופס:", user);
  }, []);
  //----------בדיקה שלי----------//

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues,
  });

  //----------בדיקה שלי----------//
  const onSubmit = async (values: ProfileUpdateFormValues) => {
    console.log("📤 נשלח לשרת:", values);
    //----------בדיקה שלי----------//

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) throw new Error("Failed to update");

      //----------בדיקה שלי----------//
      const dataFromServer = await res.json();
      console.log("✅ תגובת שרת:", dataFromServer);
      //----------בדיקה שלי----------//

      setSuccessMessage("הפרטים עודכנו בהצלחה");
      setErrorMessage("");
      // המתן רגע לפני רענון (כדי לראות את ההודעה לשבריר שנייה)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      //----------בדיקה שלי----------//
      console.error("❌ שגיאה בשליחה:", err);
      //----------בדיקה שלי----------//

      setErrorMessage("שגיאה בעדכון הפרטים");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className="mb-3 flex items-center">
        <h2 className="text-lg font-semibold text-[#002366]">פרטים אישיים</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? (
            <X className="h-5 w-5 text-[#002366]" />
          ) : (
            <Pencil className="h-5 w-5 text-[#002366]" />
          )}
        </Button>
      </div>

      {successMessage && (
        <p className="mb-2 font-semibold text-green-600">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mb-2 font-semibold text-red-600">{errorMessage}</p>
      )}
      {!showForm && (
        <div className="max-w-md space-y-4">
          <p>
            <strong>שם פרטי:</strong> {user.firstName}
          </p>
          <p>
            <strong>שם משפחה:</strong> {user.lastName}
          </p>
          <p>
            <strong>אימייל:</strong> {user.userEmail || "לא זמין"}
          </p>
          <p>
            <strong>טלפון:</strong> {user.phoneNum || "לא זמין"}
          </p>
          {!isAdmin && (
            <>
              <p>
                <strong>תאריך לידה:</strong>{" "}
                {user.birthDay
                  ? new Date(user.birthDay).toLocaleDateString("he-IL")
                  : "לא זמין"}
              </p>
              <p>
                <strong>יישוב:</strong> {user.address || "לא זמין"}
              </p>
            </>
          )}
        </div>
      )}
      {showForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-md space-y-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם פרטי</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם משפחה</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>אימייל</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>טלפון</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isAdmin && (
              <>
                <FormField
                  control={form.control}
                  name="birthDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תאריך לידה</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "flex w-full justify-start pl-3 font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>בחר תאריך</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date
                                  ? (date.setHours(10),
                                    date.toISOString().slice(0, 10))
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
                <Combobox
                  form={form}
                  name="address"
                  label="יישוב"
                  options={cityOptions}
                  placeholder="בחר עיר"
                  searchPlaceholder="חפש עיר..."
                  notFoundText="לא נמצאה עיר"
                />
              </>
            )}

            <Button type="submit">שמור שינויים</Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default ProfileInfo;
