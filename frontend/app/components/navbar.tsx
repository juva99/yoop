import React from 'react'
import Link from 'next/link'
import { PiSoccerBallFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";

const Navbar = () => {
    return (
        <div className="fixed bottom-0 w-full z-50">
        <div className='relative h-20 bg-gray-100 flex items-center justify-between px-4'>
                <div className='absolute -top-7 left-15 border-7 border-gray-100 bg-gradient-to-b from-blue-600 to-blue-800 p-5 rounded-2xl'><Link href={'/create'}>
                <IoAddCircleOutline size={50} color='white'/></Link></div>
                <div className='flex flex-1 justify-evenly ml-30'>
                <Link href={'/'}><AiFillHome size={40} /></Link>
                <Link href={'/games'}><PiSoccerBallFill size={40} color='gray'/></Link>
                <Link href={'/search'}><IoSearch size={40} color='gray'/></Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar