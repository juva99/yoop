import React from "react";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "./loginForm";
import Image from "next/image";
import Link from "next/link";
import LogoWithMusic from "@/components/LogoWithMusic";

const Login = () => {
  return (
    <>
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
            zIndex: 10,
          }}
        />
        <LogoWithMusic />

        <div className="z-10 mx-5 mt-50 flex flex-col items-center rounded-xl bg-white/90 p-8 text-right shadow-lg">
          <h1 className="text-title text-4xl font-bold">רגע רגע...</h1>
          <h1 className="text-title text-4xl font-bold">מי אתה בכלל?</h1>
          <p className="text-subtitle text-2xl font-bold">
            נראה שאתה עדיין לא מחובר,
          </p>
          <p className="text-2xl font-bold text-blue-900">
            אז איך נכניס אותך למגרש?
          </p>

          <div className="mt-6 w-full">
            <LoginForm />
          </div>

          <div className="mt-4 flex w-full items-center justify-center gap-1 text-sm">
            <p className="text-gray-600">עדיין לא נרשמת?</p>
            <Link
              href="/auth/signup"
              className="font-medium text-blue-500 underline hover:text-blue-700"
            >
              הרשם עכשיו
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <Image
            src="/grass.png"
            alt="Grass Photo"
            width={200}
            height={200}
            className="h-30 w-full object-cover"
            style={{ zIndex: -1 }}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
