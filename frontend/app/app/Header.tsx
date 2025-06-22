"use client";
import NotificationsButton from "@/components/ui/Notifications";
import React from "react";
import { Role } from "./enums/role.enum";
import { usePathname } from "next/navigation";

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

const HIDDEN_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/menu",
  "/field-manager/contact",
];

type Props = {
  name: string;
  role: Role;
};
const Header: React.FC<Props> = ({ role, name }) => {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname) || !role || role !== Role.USER) {
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
};

export default Header;
