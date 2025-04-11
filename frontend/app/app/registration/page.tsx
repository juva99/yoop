import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

const Registration = ({ onSubmit }) => {
  return (
    <>
      <div className="flex items-center mb-3 ">
        <Image
          src="/goalkeeper.png"
          alt="GoalKeeper Photo"
          width={250}
          height={100}
        />
      </div>
      <div className="w-95/100 mx-auto">
        <h1 className="text-4xl font-bold text-blue-500 "> וואי וואי!</h1>
        <h2 className="text-1xl text-blue-900 font-bold p-1">
          {" "}
          אוטוטו אתה עולה למגרש, פוגש חברים חדשים, ונותן גול מהסרטים ⚽️🔥{" "}
        </h2>
        <p className="text-gray-800 p-1">
          <strong className="text-gray-800 font-bold">
            {" "}
            כל מה שנשאר זה למלא את הפרטים -{" "}
          </strong>
          ותכף תמצא את עצמך אומר: "איך חייתי בלי זה עד עכשיו?!"
        </p>
        <p className="text-gray-800 font-bold p-1">
          {" "}
          יאללה, תן פס - ונתקדם &gt;&gt;
        </p>
        <div>
          <form onSubmit={onSubmit} className="flex flex-col mt-10">
            <label className="mb-1 ">אימייל</label>
            <input
              type="email"
              placeholder="alex_manager@gmail.com"
              required
              className="mb-4 border-b-2 border-gray-300 text-right"
            ></input>
            <label className="mb-1">סיסמא</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="mb-4 border-b-2 border-gray-300 text-right"
            ></input>
            <label className="mb-1">מספר נייד</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              placeholder="0501234567"
              required
              className="mb-4 border-b-2 border-gray-300 text-right"
            ></input>
            <label className="mb-1">גיל</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="21"
              required
              className="mb-4 border-b-2 border-gray-300 text-right"
            ></input>
            <button
              type="submit"
              className="bg-blue-500 text-white mt-4 p-2 rounded-sm mx-10"
            >
              הירשם עכשיו
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-2 mt-6">
          <h1 className="text-center text-gray-800 ">או הירשם עם</h1>
          <div className="flex gap-4">
            <button type="button">
              <AiFillGoogleCircle
                size={32}
                className="text-gray-400 hover:text-orange-700"
              />
            </button>
            <button type="button">
              <FaFacebook
                size={28}
                className="text-gray-400 hover:text-blue-700"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
//flex flex-col items-center gap-2 mt-4
export default Registration;
