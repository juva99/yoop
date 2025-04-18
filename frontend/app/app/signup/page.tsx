"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault(); // Prevent the default form submission behavior
  console.log("form submitted");
}

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
        <p className="p-1 font-bold text-gray-800">
          {" "}
          יאללה, תן פס - ונתקדם &gt;&gt;
        </p>
        <div>
          <form onSubmit={onSubmit} className="mt-10 flex flex-col">
            <label className="mb-1">אימייל</label>
            <input
              type="email"
              placeholder="alex_manager@gmail.com"
              required
              className="input_underscore"
            ></input>
            <label className="mb-1">סיסמא</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="input_underscore"
            ></input>
            <label className="mb-1">מספר נייד</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              placeholder="0501234567"
              required
              className="input_underscore"
            ></input>
            <label className="mb-1">גיל</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="21"
              required
              className="input_underscore"
            ></input>
            <button
              type="submit"
              className="mx-10 mt-4 rounded-sm bg-blue-500 p-2 text-white"
            >
              הירשם עכשיו
            </button>
          </form>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
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
      </div>
    </>
  );
};

export default SignUp;
