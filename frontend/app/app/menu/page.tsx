import Link from "next/link";
import React from "react";

type Props = {
  // your props here
};

const page: React.FC<Props> = ({}) => {
  return (
    <div>
      <Link
        href={"/api/auth/signout"}
        className="text-l flex h-10 w-40 items-center justify-center rounded-full bg-[#212429] text-white"
      >
        התנתק
      </Link>
    </div>
  );
};

export default page;
