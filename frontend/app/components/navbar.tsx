"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  PiSoccerBall,
  PiHouseFill,
  PiMagnifyingGlass,
  PiPlusCircle,
} from "react-icons/pi";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around bg-gray-100">
      <Link href={"/"}>
        <PiHouseFill
          className={`${isActive("/") ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
      <Link href={"/create"}>
        <PiPlusCircle
          className={`${isActive("/create") ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
      <Link href={"/games"}>
        <PiSoccerBall
          className={`${isActive("/games") ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
      <Link href={"/search"}>
        <PiMagnifyingGlass
          className={`${isActive("/search") ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
    </nav>
  );
};

export default Navbar;
