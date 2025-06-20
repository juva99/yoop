import NotificationsButton from "@/components/ui/Notifications";
import { getSession } from "@/lib/session";
import React from "react";
import { Role } from "./enums/role.enum";
const getGreeting = (name: string): string => {
  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12
      ? "בוקר טוב"
      : hours < 18
        ? "צהריים טובים"
        : hours < 22
          ? "ערב טוב"
          : "לילה טוב";
  return `${greeting} ${name.split(" ")[0]}`;
};
const Header: React.FC = async () => {
  const session = await getSession();

  if (!session) {
    return null;
  } else {
    const { name, role } = session!.user;
    if (role !== Role.USER) {
      return null;
    } else {
      return (
        <header className="mb-2 flex h-16 flex-row items-center justify-between pr-15 pl-3">
          <span className="text-title text-xl font-bold">
            {getGreeting(name)}
          </span>
          <NotificationsButton />
        </header>
      );
    }
  }
};

export default Header;
