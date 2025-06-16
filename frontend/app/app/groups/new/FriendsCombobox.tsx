"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types/User";

type Props = {
  friends: User[];
  selectedIds: string[];
  onChange: (newSelected: string[]) => void;
};

export const FriendsCombobox: React.FC<Props> = ({
  friends,
  selectedIds,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleFriend = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((uid) => uid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full justify-start"
        >
          {selectedIds.length > 0
            ? `נבחרו ${selectedIds.length} חברים`
            : "בחר חברים"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="חפש חבר..." />
          <CommandEmpty>לא נמצאו חברים</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-28">
              {friends.map((friend) => (
                <CommandItem
                  key={friend.uid}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFriend(friend.uid);
                  }}
                  className="flex cursor-pointer justify-between"
                >
                  <span>
                    {friend.firstName} {friend.lastName}
                  </span>
                  <Checkbox
                    checked={selectedIds.includes(friend.uid)}
                    onChange={() => {}} // למניעת אזהרות
                  />
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
