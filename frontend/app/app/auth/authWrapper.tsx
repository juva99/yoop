import React from "react";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-10">
      <Image
        src="/symbol.png"
        alt="symbol"
        width={100}
        height={100}
        className="absolute top-0 left-0 z-1"
      />

      <div className="flex w-full justify-center py-5">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4 rounded-full shadow-2xl"
        />
      </div>
      {children}
    </div>
  );
};

export default AuthWrapper;
