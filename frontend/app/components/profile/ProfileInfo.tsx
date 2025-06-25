"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/types/User";
import { updateProfile } from "@/lib/auth";

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
import ProfileImg from "./ProfilePicture";

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

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues,
  });
  const onSubmit = async (values: ProfileUpdateFormValues) => {
    try {
      const result = await updateProfile(user.uid, values);

      if (result?.error) {
        setErrorMessage(result.message || "שגיאה בעדכון הפרטים");
        setSuccessMessage("");
      } else {
        setSuccessMessage("הפרטים עודכנו בהצלחה");
        setErrorMessage("");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setErrorMessage("שגיאה בעדכון הפרטים");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-center">
        <ProfileImg userId={user.uid} />
      </div>
      <div className="mb-3 flex items-center">
        <span className="text-lg font-semibold text-[#002366]">
          פרטים אישיים
        </span>
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
        <div className="text-md max-w-md space-y-6">
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
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
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
              </>
            )}

            <Button type="submit" variant={"submit"}>
              שמור שינויים
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default ProfileInfo;
