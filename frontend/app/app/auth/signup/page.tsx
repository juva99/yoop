import React from "react";
import SignupForm from "../../../components/auth/signupForm";
import Link from "next/link";
import AuthWrapper from "../../../components/auth/authWrapper";

const SignUp = () => {
  return (
    <AuthWrapper>
      <h2>כמה פרטים קטנים ואתה על המגרש</h2>
      <div className="mt-4 w-full">
        <SignupForm />
      </div>

      <div className="mt-4 flex w-full items-center justify-center gap-1 text-sm">
        <p className="text-gray-600">כבר רשום למערכת?</p>
        <Link
          href="/auth/login"
          className="font-medium text-blue-500 underline hover:text-blue-700"
        >
          התחבר עכשיו
        </Link>
      </div>
    </AuthWrapper>
  );
};

export default SignUp;
