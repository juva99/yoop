"use client";
import React, { ReactNode }  from "react";
import { GoTriangleDown } from "react-icons/go";

type Props = { 
    text: string,
    icon: ReactNode,
}

const Filter: React.FC<Props> = ({text,icon}) => {
    return (
        <div className={`filter-wrapper border-1 rounded-4xl flex pl-3 pr-3 pb-1 pt-1 items-center gap-2`}>
            <div className="cursor-pointer"><GoTriangleDown color="gray" /></div>
            <div className="filter-text">{text}</div>
            <div className="filter-icon">{icon}</div>
        </div>
    )


}

export default Filter;