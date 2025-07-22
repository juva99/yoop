"use client";
import Image from "next/image";

const NotFound: React.FC = () => {
  return (
    <div className="text-title mt-20 flex h-full flex-col items-center gap-5 text-center font-bold">
      <Image
        src="/logo.png"
        alt="Logo"
        width={100}
        height={100}
        className="mb-4 rounded-full shadow-2xl"
      />
      <p className="text-4xl">הלכנו לאיבוד 🤷🏻‍♂️</p>
      <p className="text-xl">מצטערים, העמוד שחיפשת לא קיים.</p>
    </div>
  );
};

export default NotFound;
