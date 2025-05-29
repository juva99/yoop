import React from "react";
import Image from "next/image";

const page: React.FC = () => {
  return (
    <div className="bg-title flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-10">
      <Image
        src="/symbol.png"
        alt="symbol"
        width={100}
        height={100}
        className="absolute top-0 left-0 z-1"
      />
      <div className="flex w-full justify-center">
        <Image
          src="/yoop.png"
          alt="Logo"
          width={200}
          height={200}
          className="mt-10"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl font-bold text-white">ממשק ניהול</span>
        <span className="text-2xl font-bold text-white">מנהל מגרש</span>
      </div>
    </div>
  );
};

export default page;
