"use client";

import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { User } from "@/app/types/User";
import { Group } from "@/app/types/Group";
import { fetchUserById } from "@/lib/actions";
import { FriendsCombobox } from "@/app/groups/new/FriendsCombobox";

const formSchema = z.object({
  friendIds: z.array(z.string()).optional(),
  groupIds: z.array(z.string()).optional(),
});

type InviteFriendsProps = {
  friends: User[];
  groups: Group[];
  gameId: string;
  userId: string;
};

const InviteFriends: React.FC<InviteFriendsProps> = ({
  friends,
  groups,
  gameId,
  userId,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friendIds: [],
      groupIds: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const friendIds = data.friendIds ?? [];
      const groupIds = data.groupIds ?? [];

      // קח מזהי משתמשים מהקבוצות
      const groupUserIds = groups
        .filter((g) => groupIds.includes(g.groupId))
        .flatMap((g) => g.groupMembers.map((m) => m.id));

      // איחוד, הסר כפולים, הסר את המשתמש עצמו
      const uniqueUserIds = Array.from(
        new Set([...friendIds, ...groupUserIds]),
      ).filter((id) => id !== userId);

      if (uniqueUserIds.length === 0) {
        toast.error("לא נבחרו חברים לשליחה");
        return;
      }

      const users: User[] = await Promise.all(
        uniqueUserIds.map((id) => fetchUserById(id)),
      );

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/games/${gameId}/invite`,
        {
          method: "POST",
          body: JSON.stringify(users),
        },
      );

      if (!res.ok) throw new Error("שליחת ההזמנות נכשלה");

      toast.success("ההזמנות נשלחו בהצלחה");
      form.reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("אירעה שגיאה בשליחת ההזמנות");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-primary hover:text-primary/70 text-xl"
        >
          <FaUserPlus />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>הזמן חברים</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="friendIds"
              render={({ field }) => (
                <FormItem>
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
            <Button type="submit" className="w-full">
              הזמן
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriends;
