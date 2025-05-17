"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User } from "@/app/types/User";
import { authFetch } from "@/lib/authFetch";
import FriendList from "@/components/friends/FriendList";

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
import { Pencil, X } from "lucide-react";

const allCities = Object.values(City);

type Props = {
  user: User;
  friendRelations: any[];
};

const ProfileClient: React.FC<Props> = ({ user, friendRelations }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    console.log("📥 נתוני התחלה בטופס:", defaultValues);
  }, []);

  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues,
  });

  const onSubmit = async (values: ProfileUpdateFormValues) => {
    console.log("📤 נשלח לשרת:", values);

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      const dataFromServer = await res.json();
      console.log("✅ תגובת שרת:", dataFromServer);

      setSuccessMessage("הפרטים עודכנו בהצלחה");
      setErrorMessage("");
    } catch (err) {
      console.error("❌ שגיאה בשליחה:", err);
      setErrorMessage("שגיאה בעדכון הפרטים");
      setSuccessMessage("");
    }
  };

  const handleCityInput = (value: string) => {
    form.setValue("address", value as City);
    const matches = allCities.filter((city) =>
      city.startsWith(value)
    );
    setCitySuggestions(matches);
  };

  return (
    <div className="w-full p-4">
      <div className="rounded-md bg-white p-6">
        <h1 className="mb-6 text-2xl text-[#002366]">פרופיל אישי </h1>

        <section className="mb-6">
          <div className="flex items-center mb-3">
            <h2 className="text-lg font-semibold text-[#002366]">
              פרטים אישיים
            </h2>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm
                  ? <X className="h-5 w-5 text-[#002366]" />
                  : <Pencil className="h-5 w-5 text-[#002366]" />
                }
            </Button>
          </div>

          {successMessage && (
            <p className="mb-2 text-green-600 font-semibold">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="mb-2 text-red-600 font-semibold">{errorMessage}</p>
          )}

          {showForm && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-w-md"
              >
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם פרטי</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם משפחה</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="userEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>אימייל</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phoneNum" render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="birthDay" render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך לידה</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>יישוב</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="הקלד את שם היישוב"
                          value={form.watch("address")}
                          onChange={(e) => handleCityInput(e.target.value)}
                        />
                        {citySuggestions.length > 0 && (
                          <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                            {citySuggestions.map((city) => (
                              <li
                                key={city}
                                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  form.setValue("address", city as City);
                                  setCitySuggestions([]);
                                }}
                              >
                                {city}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit">שמור שינויים</Button>
              </form>
            </Form>
          )}
        </section>

        <hr className="my-6 border-t border-gray-200" />
        <FriendList currentUserUid={user.uid} relations={friendRelations} />
      </div>
    </div>
  );
};

export default ProfileClient;
