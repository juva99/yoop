import React from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Login = () => {
  return (
    <div className="mx-5 mt-20 text-right">
      <h1 className="text-title text-4xl font-bold">רגע רגע...</h1>
      <h1 className="text-title text-4xl font-bold">מי אתה בכלל?</h1>
      <p className="text-subtitle text-2xl font-bold">
        נראה שאתה עדיין לא מחובר,
      </p>
      <p className="text-2xl font-bold text-blue-900">
        אז איך נכניס אותך למגרש?
      </p>
      <p className="mt-2 font-bold text-gray-800">התחבר ותוך שנייה אתה בפנים</p>
      <div className="mt-10">
        <form className="flex flex-col gap-2">
          <label className="text-right">אימייל</label>
          <input
            type="text"
            placeholder="alex_manager@gmail.com"
            className="input_underscore"
          />
          <label className="text-right">סיסמא</label>
          <input
            type="password"
            placeholder="••••••••"
            className="input_underscore"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-500 p-2 text-white"
          >
            התחבר
          </button>
        </form>
        <div className="mt-4 flex flex-col items-start gap-2">
          <h1 className="text-gray-500">או התחבר עם</h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 rounded-full bg-blue-600 p-2 text-white">
              <FaGoogle />
            </button>
            <button className="flex items-center gap-2 rounded-full bg-blue-800 p-2 text-white">
              <FaFacebookF />
            </button>
          </div>
        </div>
        <p className="mt-4 cursor-pointer text-blue-500 underline">
          עדיין לא רשום?
        </p>
      </div>
    </div>
  );
};

export default Login;
