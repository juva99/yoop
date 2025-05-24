"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import SignupForm from "./signupForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="absolute flex min-h-screen flex-col items-center bg-white">
      <Image
        src="/BlueLogo.png"
        alt="Blue Logo"
        width={120}
        height={120}
        className="absolute"
        style={{
          top: 50,
          left: 68,
          transform: "translate(-60%, -60%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      <div className="z-10 mx-2 mt-10 flex w-[95vw] max-w-md flex-col items-center rounded-xl bg-white/90 p-8 text-right shadow-lg">
        <h1 className="text-4xl font-bold text-blue-500">וואי וואי!</h1>
        <p className="mt-1 text-xl font-bold text-gray-800">
          אוטוטו אתה עולה למגרש, פוגש חברים חדשים, ונותן גול מהסרטים ⚽️🔥
        </p>
        <p className="mt-2 text-sm text-gray-800">
          <strong className="font-bold text-gray-800">
            כל מה שנשאר זה למלא את הפרטים –
          </strong>{" "}
          ותכף תמצא את עצמך אומר: "איך חייתי בלי זה עד עכשיו?!"
        </p>

        <div className="mt-6 w-full">
          <SignupForm />
        </div>

        <div className="mt-4 flex w-full items-center justify-center gap-1 text-sm">
          <p className="text-gray-600">כבר רשום למערכת?</p>
          <Link
            href="/auth/login"
            className="font-medium text-blue-500 underline hover:text-blue-700"
          >
            התחבר עכשיו
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
