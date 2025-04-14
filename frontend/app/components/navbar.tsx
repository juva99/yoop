import React from 'react'
import Link from 'next/link'
import { PiSoccerBallFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";

const Navbar = () => {
    return (
        <nav className="fixed flex bg-gray-100 h-15 items-center justify-around bottom-0 w-full z-50">
                <Link href={'/'}><IoAddCircleOutline size={40}/></Link>
                <Link href={'/'}><AiFillHome size={40} /></Link>
                <Link href={'/games'}><PiSoccerBallFill size={40} color='gray'/></Link>
                <Link href={'/search'}><IoSearch size={40} color='gray'/></Link>
        </nav>
    )
}

export default Navbar