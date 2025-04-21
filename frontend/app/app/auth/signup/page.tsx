"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";
import SignupForm from "./signupForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <>
      <div className="mb-3 flex items-center">
        <Image
          src="/goalkeeper.png"
          alt="GoalKeeper Photo"
          width={250}
          height={100}
        />
      </div>
      <div className="mx-auto w-95/100">
        <h1 className="text-4xl font-bold text-blue-500"> וואי וואי!</h1>
        <h2 className="text-1xl p-1 font-bold text-blue-900">
          {" "}
          אוטוטו אתה עולה למגרש, פוגש חברים חדשים, ונותן גול מהסרטים ⚽️🔥{" "}
        </h2>
        <p className="p-1 text-gray-800">
          <strong className="font-bold text-gray-800">
            {" "}
            כל מה שנשאר זה למלא את הפרטים -{" "}
          </strong>
          ותכף תמצא את עצמך אומר: "איך חייתי בלי זה עד עכשיו?!"
        </p>
        <div className="mt-5">
          <SignupForm></SignupForm>
        </div>
        <div className="mt-3 flex flex-col items-center gap-2">
          <h1 className="text-center text-gray-800">או הירשם עם</h1>
          <div className="flex gap-2">
            <button type="button">
              <FcGoogle size={30} />
            </button>
            <button type="button">
              <FaFacebook size={28} className="text-blue-700" />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1 text-sm">
          <p className="text-gray-600">כבר רשום למערכת?</p>
          <Link
            href={"/auth/login"}
            className="font-medium text-blue-500 underline hover:text-blue-700"
          >
            התחבר עכשיו
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
