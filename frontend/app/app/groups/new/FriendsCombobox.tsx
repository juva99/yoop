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

type Member = {
  id: string;
  firstName: string;
  lastName: string;
};

type Props = {
  members: Member[];
  selectedIds: string[];
  onChange: (newSelected: string[]) => void;
};

export const FriendsCombobox: React.FC<Props> = ({
  members,
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
              {members.map((member) => (
                <CommandItem
                  key={member.id}
                  onSelect={() => toggleMember(member.id)}
                  className="flex justify-between"
                >
                  {member.firstName} {member.lastName}
                  <Checkbox checked={selectedIds.includes(member.id)} />
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
