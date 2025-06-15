"use client";
import Link from "next/link";
import AuthWrapper from "./auth/authWrapper";

const NotFound: React.FC = () => {
  return (
    <AuthWrapper>
      <div className="text-title mt-20 flex h-full flex-col gap-5 text-center font-bold">
        <p className="text-4xl">הלכנו לאיבוד 🤷🏻‍♂️</p>
        <p className="text-xl">מצטערים, העמוד שחיפשת לא קיים.</p>
        <p className="flex gap-2">
          <Link className="underline" href="/">
            חזור לעמוד הבית
          </Link>
          <span>או שתקפיץ כדור בנתיים</span>
        </p>
      </div>
    </AuthWrapper>
  );
};

export default NotFound;
