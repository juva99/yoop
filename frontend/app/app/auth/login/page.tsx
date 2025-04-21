import React from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import LoginForm from "./loginForm";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  return (
    <div>
      <div className="direction-ltr flex w-full">
        <Image
          src="/basketballPlayer.png"
          alt="Basketball Player Photo"
          width={120}
          height={50}
          className="mr-auto"
        />
      </div>

      <div className="mx-5 text-right">
        <h1 className="text-title text-4xl font-bold">רגע רגע...</h1>
        <h1 className="text-title text-4xl font-bold">מי אתה בכלל?</h1>
        <p className="text-subtitle text-2xl font-bold">
          נראה שאתה עדיין לא מחובר,
        </p>
        <p className="text-2xl font-bold text-blue-900">
          אז איך נכניס אותך למגרש?
        </p>
      </div>

      <LoginForm />

      <div className="mt-3 flex flex-col items-center gap-2">
        <h1 className="text-center text-gray-800">או התחבר עם</h1>
        <div className="flex gap-4">
          <button type="button">
            <FcGoogle size={35} />
          </button>
          <button type="button">
            <FaFacebook size={32} className="text-blue-700" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1 text-sm">
        <p className="text-gray-600">עדיין לא נרשמת?</p>
        <Link
          href={"/auth/signup"}
          className="font-medium text-blue-500 underline hover:text-blue-700"
        >
          הרשם עכשיו
        </Link>
      </div>

      <Image
        src="/grass.png"
        alt="Grass Photo"
        width={100}
        height={100}
        className="absolute bottom-0 left-0 h-10 w-full object-cover"
        style={{ zIndex: -1 }}
      />
    </div>
  );
};

export default Login;
