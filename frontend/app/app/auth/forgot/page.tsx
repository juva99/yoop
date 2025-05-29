import React from "react";
import LoginForm from "./forgot-form";
import Link from "next/link";
import AuthWrapper from "../authWrapper";

const ForgotPassword = () => {
  return (
    <AuthWrapper>
      <div className="text-center">
        <h2 className="text-2xl font-bold">שכחת את הסיסמה?</h2>
        <p className="mt-2 text-gray-600">
          הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
        </p>
      </div>
      <div className="mt-6 w-full">
        <LoginForm />
      </div>
      <div className="text-center text-sm text-gray-600">
        <div className="mt-4 flex w-full items-center justify-center gap-1">
          <p>נזכרת בסיסמה?</p>
          <Link href="/auth/login" className="text-title font-medium underline">
            חזור להתחברות
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ForgotPassword;
