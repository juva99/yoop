"use client";

import React from "react";
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
  const toggleMember = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((m) => m !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedIds.length > 0
            ? `נבחרו ${selectedIds.length} חברים`
            : "בחר חברים להצטרפות"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="חפש חבר..." />
          <CommandEmpty>לא נמצאו חברים</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-48">
              {friends.map((friend) => (
                <CommandItem
                  key={friend.uid}
                  onSelect={() => toggleMember(friend.uid)}
                  className="flex justify-between"
                >
                  {friend.firstName} {friend.lastName}
                  <Checkbox checked={selectedIds.includes(friend.uid)} />
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
