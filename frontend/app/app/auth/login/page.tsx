import React from "react";
import LoginForm from "./loginForm";
import Link from "next/link";
import AuthWrapper from "../authWrapper";

const Login = () => {
  return (
    <AuthWrapper>
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
        <Link href="/contact" className="text-title font-medium underline">
          כמנהל מגרש{" "}
        </Link>
      </div>
    </AuthWrapper>
  );
};

export default Login;
