"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  PiSoccerBall,
  PiHouseFill,
  PiMagnifyingGlass,
  PiPlusCircle,
} from "react-icons/pi";

const Navbar = () => {
  const [activePage, setActivePage] = useState<string>("home");
  return (
    <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around bg-gray-100">
      <Link href={"/"}>
        <PiHouseFill
          className={`${activePage === "home" ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
      <Link href={"/"}>
        <PiPlusCircle
          className={`${activePage === "create" ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
      <Link href={"/games"}>
        <PiSoccerBall
          className={`${activePage === "" ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
      <Link href={"/search"}>
        <PiMagnifyingGlass
          className={`${activePage === "search" ? "font-black" : "text-elements"} size-[30px]`}
        />
      </Link>
    </nav>
  );
};

export default Navbar;
