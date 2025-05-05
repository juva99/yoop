"use client";

import React from "react";
import Link from "next/link";
import {
  PiSoccerBall,
  PiMagnifyingGlass,
} from "react-icons/pi";
import { FaHouse } from "react-icons/fa6";
import { IoCreateSharp } from "react-icons/io5";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/auth/login", "/auth/signup"];

const Navbar = () => {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname))
    return null;

  return (
    <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around border-t-3 border-blue-700 bg-gray-100">
      <Link href={"/"}>
        <FaHouse
          className={`size-[40px] ${pathname === "/" ? "text-neutral-900" : "text-elements"}`}
        />
      </Link>
      <Link href={"/mygames"}>
        <PiSoccerBall
          className={`size-[40px] ${pathname === "/mygames" ? "text-neutral-900" : "text-elements"}`}
        />
      </Link>
      <Link href={"/search"}>
        <PiMagnifyingGlass
          className={`size-[40px] ${pathname === "/search" ? "text-neutral-900" : "text-elements"}`}
        />
      </Link>
      <Link href={"/game/create"}>
        <div className="-mt-10 flex size-[80px] items-center justify-center rounded-2xl border-2 border-blue-500 bg-blue-800 shadow-md ring-2 ring-blue-100 transition-all">
          <IoCreateSharp className="size-[48px] text-white drop-shadow" />
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
