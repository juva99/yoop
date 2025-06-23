"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FriendsCombobox } from "./FriendsCombobox";
import { GameType } from "@/app/enums/game-type.enum";
import GameTypeOption from "@/components/create-field/game-type-option";
import { formSchema, FormSchema } from "@/lib/schemas/new-group.schema";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { Group } from "@/app/types/Group";
import { redirect } from "next/navigation";
import { User } from "@/app/types/User";

export type Friend = {
  id: string;
  firstName: string;
  lastName: string;
};

type Props = {
  friends: User[];
  newGroup?: boolean;
  groupId?: string;
  groupValues?: {
    groupName?: string;
    gameTypes?: GameType[];
    userIds?: string[];
    groupPicture?: string | undefined;
  };
};

const NewGroupForm: React.FC<Props> = ({
  friends,
  groupValues,
  groupId,
  newGroup,
}) => {
  const [submitClicked, setSubmitClicked] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      gameTypes: [],
      userIds: [],
      groupPicture: undefined,
    },
  });

  useEffect(() => {
    if (groupValues) {
      form.reset(groupValues);
    }
  }, [groupValues, form]);
  const onSubmit = async (data: FormSchema) => {
    console.log("Form data submitted:", data);

    setSubmitClicked(true);
    const isEdit = !!groupValues;

    const url =
      isEdit && groupId
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/update`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/create`;

    const res = await authFetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: groupId
        ? JSON.stringify({ ...data, groupId })
        : JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(isEdit ? "הקבוצה עודכנה בהצלחה" : "הקבוצה נוצרה בהצלחה");
      const group: Group = await res.json();
      redirect(`/groups/${group.groupId}`);
    } else {
      const errorData = await res.json().catch(() => null);
      console.log("Error response data:", errorData.message || errorData);

      toast.error("אירעה תקלה, נסה שוב מאוחר יותר");
      setSubmitClicked(false);
    }
  };

  const buttonText = groupValues ? "עדכן קבוצה" : "צור קבוצה";
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full space-y-4 p-5"
      >
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם הקבוצה</FormLabel>
              <FormControl>
                <Input {...field} placeholder="הזן שם לקבוצה" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gameTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>איזה סוג משחקים תשחקו?</FormLabel>

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
        {newGroup && (
          <FormField
            control={form.control}
            name="userIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>חברים בקבוצה</FormLabel>
                <FormControl>
                  <FriendsCombobox
                    friends={friends}
                    selectedIds={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="groupPicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תמונה (אופציונלי)</FormLabel>
              <FormControl>
                <Input id="picture" type="file" onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || submitClicked}
        >
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default NewGroupForm;
