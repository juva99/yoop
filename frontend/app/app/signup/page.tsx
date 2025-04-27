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
        <h1 className="text-4xl font-bold text-blue-500">
          {" "}
          עוד רגע ואתה על המגרש!
        </h1>
        <p className="p-1 font-bold text-gray-800">
          {" "}
          כמה פרטים טכנים ומתקדמים &gt;&gt;
        </p>
        <div className="px-3">
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
              className="mt-4 rounded-[4px] bg-blue-500 p-2 text-white"
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
