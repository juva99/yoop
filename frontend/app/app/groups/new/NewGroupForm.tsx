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
import { User } from "@/app/types/User";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
type Friend = {
  id: string;
  firstName: string;
  lastName: string;
};
type FriendRelation = {
  id: string;
  user1: User;
  user2: User;
};
type Props = {
  relations: FriendRelation[];
  userId: string;
};

const NewGroupForm: React.FC<Props> = ({ relations, userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const friendList: Friend[] = relations.map((rel) =>
      rel.user1.uid === userId
        ? {
            id: rel.user2.uid,
            firstName: rel.user2.firstName,
            lastName: rel.user2.lastName,
          }
        : {
            id: rel.user1.uid,
            firstName: rel.user1.firstName,
            lastName: rel.user1.lastName,
          },
    );

    setFriends(friendList);
  }, [relations, userId]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      gameTypes: [],
      groupMembers: [],
      groupPicture: undefined,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    console.log("Submitted:", data);
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (res.ok) {
      toast.success("הקבוצה נוצרה בהצלחה");
    } else {
      toast.error("אירעה תקלה, נסה שוב מאוחר יותר");
    }
  };

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

        <FormField
          control={form.control}
          name="groupMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>חברים בקבוצה</FormLabel>
              <FormControl>
                <FriendsCombobox
                  members={friends}
                  selectedIds={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" className="w-full">
          צור קבוצה
        </Button>
      </form>
    </Form>
  );
};

export default NewGroupForm;
