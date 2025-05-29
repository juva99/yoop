"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import SignupForm from "./signupForm";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import AuthWrapper from "../authWrapper";

const SignUp = () => {
  return (
    <AuthWrapper>
      <div className="w-full">
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
