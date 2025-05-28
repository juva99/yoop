import React from "react";
import ResetPasswordForm from "./reset-password-form";
import Image from "next/image";
import Link from "next/link";

const ResetPassword = () => {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-6 py-10">
      <Image
        src="/symbol.png"
        alt="symbol"
        width={100}
        height={100}
        className="absolute top-0 left-0 z-1"
      />

      <div className="flex w-full justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4 rounded-full shadow-2xl"
        />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">איפוס סיסמה</h2>
        <p className="mt-2 text-gray-600">הזן את הסיסמה החדשה שלך.</p>
      </div>
      <div className="mt-6 w-full">
        <ResetPasswordForm />
      </div>
      <div className="text-center text-sm text-gray-600">
        <div className="mt-4 flex w-full items-center justify-center gap-1">
          <p>נזכרת בסיסמה?</p>
          <Link href="/auth/login" className="text-title font-medium underline">
            חזור להתחברות
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
