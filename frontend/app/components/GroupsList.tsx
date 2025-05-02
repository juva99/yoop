"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/app/types/User";
import AvatarGroup from "./AvatarGroup";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Define the Group type based on the data structure used in the home page
type Group = {
  id: string;
  name: string;
  players: User[];
  maxPlayers?: number; // Optional maximum number of players
  remainingTime?: string; // Optional countdown time (HH:MM:SS format)
};

interface Props {
  groups: Group[];
}

const GroupsList: React.FC<Props> = ({ groups }) => {
  return (
    <div className="border-elements w-full">
      <Carousel className="w-full" opts={{ direction: "rtl", loop: true }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {groups.map((group) => (
            <CarouselItem
              key={group.id}
              className="basis-full pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
            >
              <Link href={`/group/${group.id}`} className="block h-full">
                <div className="border-elements h-full rounded-lg border p-6">
                  <div className="mb-4 border-b border-gray-200 pb-2 text-center">
                    <p className="text-[20px] font-medium text-blue-400">
                      {group.name}
                    </p>
                  </div>
                  <AvatarGroup players={group.players} />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default GroupsList;
