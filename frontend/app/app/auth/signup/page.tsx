"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import SignupForm from "./signupForm";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const SignUp = () => {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="absolute top-0 left-0 z-1">
        <Image src="/BlueLogo.png" alt="Blue Logo" width={80} height={80} />
      </div>
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
  );
};

export default SignUp;
