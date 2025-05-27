import React from "react";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "./loginForm";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-6 py-10">
      <Image
        src="/symbol.png"
        alt="symbol"
        width={100}
        height={100}
        className="absolute top-0 left-0 z-1"
      />

      <div className="flex w-full justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4 rounded-full shadow-2xl"
        />
      </div>
      <div className="text-center">
        <h2>נראה שאתה עדיין לא מחובר,</h2>
        <h2>אז איך נכניס אותך למגרש?</h2>
      </div>
      <div className="mt-6 w-full">
        <LoginForm />
      </div>
      <div className="text-center text-sm text-gray-600">
        <div className="mt-4 flex w-full items-center justify-center gap-1">
          <p>עדיין לא נרשמת?</p>
          הרשם
          <Link
            href="/auth/signup"
            className="text-title font-medium underline"
          >
            בתור שחקן
          </Link>
        </div>
        או{" "}
        <Link
          href="/field-manager/contact"
          className="text-title font-medium underline"
        >
          כמנהל מגרש{" "}
        </Link>
      </div>
    </div>
  );
};

export default Login;
