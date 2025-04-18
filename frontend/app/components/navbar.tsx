import React from "react";
import Link from "next/link";
import { PiSoccerBallFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 z-50 flex h-15 w-full items-center justify-around bg-gray-100">
      <Link href={"/"}>
        <IoAddCircleOutline size={40} />
      </Link>
      <Link href={"/"}>
        <AiFillHome size={40} />
      </Link>
      <Link href={"/games"}>
        <PiSoccerBallFill size={40} color="gray" />
      </Link>
      <Link href={"/search"}>
        <IoSearch size={40} color="gray" />
      </Link>
    </nav>
  );
};

export default Navbar;
