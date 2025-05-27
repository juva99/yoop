"use client";

import React from "react";
import Link from "next/link";
import { PiSoccerBall, PiMagnifyingGlassBold } from "react-icons/pi";
import { FaHouse } from "react-icons/fa6";
import { MdAssignmentAdd } from "react-icons/md";
import { usePathname } from "next/navigation";
import { TbLayoutGridAdd } from "react-icons/tb";
import { Role } from "@/app/enums/role.enum";
import { GiSoccerField } from "react-icons/gi";
import { RiFunctionAddFill } from "react-icons/ri";
import { VscSignOut } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";

const HIDDEN_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/menu",
  "/field-manager/contact",
];

type NavbarProps = {
  role: Role;
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname)) return null;

  if (role === Role.USER) {
    return (
      <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around border-t-1 border-[#6b6b6b] bg-gray-100">
        <Link href={"/"}>
          <FaHouse
            className={`size-[25px] ${pathname === "/" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>
        <Link href={"/mygames"}>
          <PiSoccerBall
            className={`size-[25px] ${pathname === "/mygames" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>
        <Link href={"/menu"}>
          <TbLayoutGridAdd
            className={`size-[25px] ${pathname === "/menu" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>
        <Link href={"/search"}>
          <PiMagnifyingGlassBold
            className={`size-[25px] ${pathname === "/search" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>
        <Link href={"/game/create"}>
          <div className="-mt-10 flex size-[80px] items-center justify-center rounded-[25%] border-2 border-blue-500 bg-[radial-gradient(80.49%_80.3%_at_47.16%_59.68%,#0D2A84_0%,#116AAC_100%)] shadow-md ring-2 ring-blue-100 transition-all">
            <MdAssignmentAdd className="size-[48px] text-white drop-shadow" />
          </div>
        </Link>
      </nav>
    );
  }

  if (role === Role.FIELD_MANAGER || role === Role.ADMIN) {
    return (
      <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around border-t-1 border-[#6b6b6b] bg-gray-100">
        <Link href={"/profile"}>
          <CgProfile
            className={`size-[25px] ${pathname === "/profile" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>

        <Link href={"/field-manager/fields"}>
          <GiSoccerField
            className={`size-[25px] ${pathname === "/field-manager/fields" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>

        <Link href={"/field-manager/field/games"}>
          <RiFunctionAddFill
            className={`size-[25px] ${pathname === "/field-manager/field/games" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>

        <Link href={"/api/auth/signout"}>
          <VscSignOut
            className={`size-[25px] ${pathname === "/api/auth/signout" ? "text-neutral-900" : "text-elements"}`}
          />
        </Link>
      </nav>
    );
  }
  return null;
};

export default Navbar;
