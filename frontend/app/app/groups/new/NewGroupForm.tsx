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
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/app/types/User";
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
      gameType: [],
      isPrivate: false,
      members: [],
    },
  });

  const onSubmit = (data: FormSchema) => {
    console.log("Submitted:", data);
    // שלח לשרת וכו'
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
          name="gameType"
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
          name="isPrivate"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <FormControl>
                  <Checkbox
                    id="isPrivate"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>אני מעוניין שהקבוצה תהיה פרטית</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="members"
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

        <Button type="submit" className="w-full">
          צור קבוצה
        </Button>
      </form>
    </Form>
  );
};

export default NewGroupForm;
