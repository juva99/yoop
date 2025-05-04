import React from "react";
import Link from "next/link";
import {
  PiSoccerBall,
  PiHouseSimple,
  PiMagnifyingGlass,
  PiPlusCircle,
} from "react-icons/pi";

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around bg-gray-100">
      <Link href={"/game/create"}>
        <PiPlusCircle className="text-elements size-[40px]" />
      </Link>
      <Link href={"/"}>
        <PiHouseSimple className="text-elements size-[40px]" />
      </Link>
      <Link href={"/games"}>
        <PiSoccerBall className="text-elements size-[40px]" />
      </Link>
      <Link href={"/search"}>
        <PiMagnifyingGlass className="text-elements size-[40px]" />
      </Link>
    </nav>
  );
};

export default Navbar;
